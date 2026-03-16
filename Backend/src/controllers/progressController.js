const pool = require("../config/db")

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

