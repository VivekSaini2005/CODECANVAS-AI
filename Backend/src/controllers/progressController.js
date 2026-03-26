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

        // 1. Fetch all users from users table
        const usersResult = await pool.query(`SELECT * FROM users`);
        const users = usersResult.rows;

        let enrichedUsers = [];
        
        // 2. For each user calculate the leaderboard score
        for (const user of users) {
             // Fetch manual stats
             const manualStatsResult = await pool.query(`
                SELECT 
                    COUNT(*) FILTER (WHERE lower(p.difficulty) = 'easy') AS easy,
                    COUNT(*) FILTER (WHERE lower(p.difficulty) = 'medium') AS medium,
                    COUNT(*) FILTER (WHERE lower(p.difficulty) = 'hard') AS hard
                FROM user_solved_problems usp
                JOIN problems p ON p.id = usp.problem_id
                WHERE usp.user_id = $1
            `, [user.id]);
            const manualStats = manualStatsResult.rows[0];

            // Fetch platform stats
            const platformStatsResult = await pool.query(`
                SELECT 
                    SUM(COALESCE(total_solved, 0)) AS total_solved,
                    SUM(COALESCE(easy_solved, 0)) AS easy,
                    SUM(COALESCE(medium_solved, 0)) AS medium,
                    SUM(COALESCE(hard_solved, 0)) AS hard,
                    MAX(rating) FILTER (WHERE lower(platform) = 'leetcode') AS lc_rating,
                    MAX(rating) FILTER (WHERE lower(platform) = 'codeforces') AS cf_rating,
                    MAX(rating) FILTER (WHERE lower(platform) = 'codechef') AS cc_rating
                FROM user_platform_stats
                WHERE user_id = $1
            `, [user.id]);
            const platformStats = platformStatsResult.rows[0];
            const manualtotal = (parseInt(manualStats.easy) || 0) + (parseInt(manualStats.medium) || 0) + (parseInt(manualStats.hard) || 0);
            // Combine stats
            const easy = parseInt(platformStats?.easy || 0);
            const medium = parseInt(platformStats?.medium || 0);
            const hard = parseInt(platformStats?.hard || 0);

            const lcRating = parseInt(platformStats?.lc_rating || 0);
            const cfRating = parseInt(platformStats?.cf_rating || 0);
            const ccRating = parseInt(platformStats?.cc_rating || 0);

            // Score calculation based on the required formula (streak factor removed)
            const score = Math.round(
                (easy * easyPoints) + 
                (medium * mediumPoints) + 
                (hard * hardPoints) + 
                ((lcRating > 0 ? lcRating : 0) + 
                (cfRating > 0 ? cfRating + 300 : 0) + 
                (ccRating > 0 ? ccRating + 100: 0)) / 10 + 
                manualtotal/10
                // ((lcRating + cfRating + 300 + ccRating + 100) / 10)
            );

            enrichedUsers.push({
                id: user.id,
                name: user.name,
                profileimage: user.profileimage,
                leetcode_username: user.leetcode_username,
                codeforces_username: user.codeforces_username,
                codechef_username: user.codechef_username,
                total_solved: platformStats?.total_solved || 0,
                lc_rating: lcRating,
                cf_rating: cfRating,
                cc_rating: ccRating,
                total_easy: easy,
                total_medium: medium,
                total_hard: hard,
                score
            });
        }

        // Sort dynamically
        enrichedUsers.sort((a, b) => b.score - a.score);

        // Rank consecutively ignoring score ties
        const leaderboard = enrichedUsers.map((user, index) => {
            return {
                rank: index + 1,
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

