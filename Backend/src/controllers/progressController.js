const pool = require("../config/db")
const SCORING_WEIGHTS = require("../config/scoringConfig")
const heatmapService = require("../services/heatmapService");
const streakCalculator = require("../utils/streakCalculator");

// ======================================
// MARK PROBLEM AS SOLVED
// ======================================


exports.updateProgress = async (req, res) => {
    try {

        const { problemId } = req.body
        const userId = req.userId

        // check if already solved
        const existing = await pool.query(
            `SELECT id FROM user_solved_problems
       WHERE user_id=$1 AND problem_id=$2`,
            [userId, problemId]
        )

        // if solved → unmark
        if (existing.rows.length > 0) {

            await pool.query(
                `DELETE FROM user_solved_problems
         WHERE user_id=$1 AND problem_id=$2`,
                [userId, problemId]
            )

            return res.json({ solved: false })
        }

        // if not solved → mark done
        const progress = await pool.query(
            `INSERT INTO user_solved_problems
       (user_id, problem_id, solved_at)
       VALUES($1,$2,NOW())
       RETURNING *`,
            [userId, problemId]
        )

        res.json({
            solved: true,
            data: progress.rows[0]
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
// exports.updateProgress = async (req, res) => {

//     try {

//         const { problemId, platform } = req.body
//         const userId = req.userId

//         const progress = await pool.query(
//             `
//             INSERT INTO user_solved_problems
//             (user_id, problem_id, platform, solved_at)
//             VALUES($1,$2,$3,NOW())
//             ON CONFLICT (user_id, problem_id, platform)
//             DO UPDATE SET solved_at = NOW()
//             RETURNING *
//             `,
//             [userId, problemId, platform]
//         )

//         res.json(progress.rows[0])

//     } catch (err) {
//         res.status(500).json({ error: err.message })
//     }

// }



// ======================================
// GET USER SOLVED PROBLEMS
// ======================================

exports.getUserProgress = async (req, res) => {

    try {

        const userId = req.userId

        const progress = await pool.query(
            `
            SELECT 
                usp.problem_id,
                p.title,
                p.slug,
                p.platform,
                p.difficulty,
                usp.solved_at
            FROM user_solved_problems usp
            JOIN problems p
            ON p.id = usp.problem_id
            WHERE usp.user_id = $1
            ORDER BY usp.solved_at DESC
            `,
            [userId]
        )

        res.json(progress.rows)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }

}



// ======================================
// USER STATS
// ======================================

exports.getUserStats = async (req, res) => {

    const userId = req.userId

    try {

        const solvedStats = await pool.query(
            `
            SELECT COUNT(*) 
            FROM user_solved_problems
            WHERE user_id=$1
            `,
            [userId]
        )

        const easyStats = await pool.query(
            `
            SELECT COUNT(*) 
            FROM user_solved_problems usp
            JOIN problems p
            ON p.id = usp.problem_id
            WHERE usp.user_id=$1 AND p.difficulty='Easy'
            `,
            [userId]
        )

        const mediumStats = await pool.query(
            `
            SELECT COUNT(*) 
            FROM user_solved_problems usp
            JOIN problems p
            ON p.id = usp.problem_id
            WHERE usp.user_id=$1 AND p.difficulty='Medium'
            `,
            [userId]
        )

        const hardStats = await pool.query(
            `
            SELECT COUNT(*) 
            FROM user_solved_problems usp
            JOIN problems p
            ON p.id = usp.problem_id
            WHERE usp.user_id=$1 AND p.difficulty='Hard'
            `,
            [userId]
        )

        res.json({
            totalSolved: parseInt(solvedStats.rows[0].count),
            easySolved: parseInt(easyStats.rows[0].count),
            mediumSolved: parseInt(mediumStats.rows[0].count),
            hardSolved: parseInt(hardStats.rows[0].count),
            sheetsCompleted: 0,
            currentStreak: 0
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// controllers/leaderboardController.js

exports.getLeaderboard = async (req, res) => {
    try {
        const { limit = 50 } = req.query;

        // Get scoring weights from config
        const { easy: easyPoints, medium: mediumPoints, hard: hardPoints } = SCORING_WEIGHTS.difficulty;

        const query = `
        WITH manual_stats AS (
            SELECT 
                usp.user_id,
                COUNT(*) FILTER (WHERE lower(p.difficulty) = 'easy') AS easy,
                COUNT(*) FILTER (WHERE lower(p.difficulty) = 'medium') AS medium,
                COUNT(*) FILTER (WHERE lower(p.difficulty) = 'hard') AS hard
            FROM user_solved_problems usp
            JOIN problems p ON p.id = usp.problem_id
            GROUP BY usp.user_id
        ),

        platform_stats AS (
            SELECT 
                user_id,
                SUM(COALESCE(easy_solved, 0)) AS easy,
                SUM(COALESCE(medium_solved, 0)) AS medium,
                SUM(COALESCE(hard_solved, 0)) AS hard,
                MAX(rating) FILTER (WHERE lower(platform) = 'leetcode') AS lc_rating,
                MAX(rating) FILTER (WHERE lower(platform) = 'codeforces') AS cf_rating,
                MAX(rating) FILTER (WHERE lower(platform) = 'codechef') AS cc_rating
            FROM user_platform_stats
            GROUP BY user_id
        )

        SELECT 
            u.id,
            u.name,
            u.profileimage,
            u.leetcode_username,
            u.codeforces_username,
            u.codechef_username,

            COALESCE(ps.lc_rating, 0) AS lc_rating,
            COALESCE(ps.cf_rating, 0) AS cf_rating,
            COALESCE(ps.cc_rating, 0) AS cc_rating,

            -- totals
            CAST((COALESCE(ms.easy, 0) + COALESCE(ps.easy, 0)) AS INTEGER) AS total_easy,
            CAST((COALESCE(ms.medium, 0) + COALESCE(ps.medium, 0)) AS INTEGER) AS total_medium,
            CAST((COALESCE(ms.hard, 0) + COALESCE(ps.hard, 0)) AS INTEGER) AS total_hard

        FROM users u
        LEFT JOIN manual_stats ms ON ms.user_id = u.id
        LEFT JOIN platform_stats ps ON ps.user_id = u.id;
        `;

        const { rows } = await pool.query(query);

        let enrichedUsers = [];
        
        for (const user of rows) {
            
            const easy = user.total_easy;
            const medium = user.total_medium;
            const hard = user.total_hard;
            const lcRating = parseInt(user.lc_rating) || 0;
            const cfRating = parseInt(user.cf_rating) || 0;
            const ccRating = parseInt(user.cc_rating) || 0;

            // Score calculation based on the required formula (streak factor removed)
            const score = Math.round(
                (easy * easyPoints) + 
                (medium * mediumPoints) + 
                (hard * hardPoints) + 
                ((lcRating + cfRating + 300 + ccRating + 100) / 10)
            );

            enrichedUsers.push({
                ...user,
                score
            });
        }

        // Sort dynamically
        enrichedUsers.sort((a, b) => b.score - a.score);

        // Rank with tie handling
        let currentRank = 1;
        let pRank = 1;
        
        const leaderboard = enrichedUsers.map((user, index) => {
            if (index > 0 && user.score < enrichedUsers[index - 1].score) {
                currentRank = index + 1;
            }

            return {
                rank: currentRank,
                ...user
            };
        });

        res.status(200).json({
            success: true,
            leaderboard: leaderboard.slice(0, parseInt(limit)),
            scoringWeights: SCORING_WEIGHTS.difficulty
        });

    } catch (error) {
        console.error("Leaderboard Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//         const query = `
//       WITH manual_stats AS (
//           SELECT 
//               usp.user_id,

//               COUNT(*) FILTER (WHERE p.difficulty = 'easy') AS easy,
//               COUNT(*) FILTER (WHERE p.difficulty = 'medium') AS medium,
//               COUNT(*) FILTER (WHERE p.difficulty = 'hard') AS hard

//           FROM user_solved_problems usp
//           JOIN problems p ON p.id = usp.problem_id

//           GROUP BY usp.user_id
//       ),

//       platform_stats AS (
//           SELECT 
//               user_id,
//               SUM(COALESCE(easy_solved, 0)) AS easy,
//               SUM(COALESCE(medium_solved, 0)) AS medium,
//               SUM(COALESCE(hard_solved, 0)) AS hard
//           FROM user_platform_stats
//           GROUP BY user_id
//       )

//       SELECT 
//           u.id,
//           u.name,
//           u.profileimage,

//           -- CodeCanva Problems
//           COALESCE(ms.easy, 0) AS codecanva_easy,
//           COALESCE(ms.medium, 0) AS codecanva_medium,
//           COALESCE(ms.hard, 0) AS codecanva_hard,

//           -- LeetCode Problems
//           COALESCE(ps.easy, 0) AS leetcode_easy,
//           COALESCE(ps.medium, 0) AS leetcode_medium,
//           COALESCE(ps.hard, 0) AS leetcode_hard,

//           -- Combined Totals
//           COALESCE(ms.easy, 0) + COALESCE(ps.easy, 0) AS total_easy,
//           COALESCE(ms.medium, 0) + COALESCE(ps.medium, 0) AS total_medium,
//           COALESCE(ms.hard, 0) + COALESCE(ps.hard, 0) AS total_hard,

//           -- Combined Score
//           (
//               (COALESCE(ms.easy, 0) + COALESCE(ps.easy, 0)) * $2 +
//               (COALESCE(ms.medium, 0) + COALESCE(ps.medium, 0)) * $3 +
//               (COALESCE(ms.hard, 0) + COALESCE(ps.hard, 0)) * $4
//           ) AS score

//       FROM users u

//       LEFT JOIN manual_stats ms ON ms.user_id = u.id
//       LEFT JOIN platform_stats ps ON ps.user_id = u.id

//       ORDER BY score DESC
//       LIMIT $1;
//     `;


//         const { rows } = await pool.query(query, [limit, easyPoints, mediumPoints, hardPoints]);
//         // console.log(rows);

//         // 🔥 Add rank dynamically
//         const leaderboard = rows.map((user, index) => ({
//             rank: index + 1,
//             ...user
//         }));

//         return res.status(200).json({
//             success: true,
//             count: leaderboard.length,
//             leaderboard,
//             scoringWeights: SCORING_WEIGHTS.difficulty  // Return weights for frontend reference
//         });

//     } catch (error) {
//         console.error("Leaderboard Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to fetch leaderboard"
//         });
//     }
// };
