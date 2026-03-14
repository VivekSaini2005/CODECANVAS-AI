const pool = require("../config/db")

exports.updateProgress = async (req,res)=>{

    const {problemId,status} = req.body
    const userId = req.userId

    const progress = await pool.query(
        `
        INSERT INTO progress(user_id,problem_id,status)
        VALUES($1,$2,$3)
        ON CONFLICT (user_id,problem_id)
        DO UPDATE SET status=$3
        RETURNING *
        `,
        [userId,problemId,status]
    )

    res.json(progress.rows[0])
}



exports.getUserProgress = async (req,res)=>{

    const userId = req.userId

    const progress = await pool.query(
        `
        SELECT p.title, pr.status
        FROM progress pr
        JOIN problems p
        ON p.id = pr.problem_id
        WHERE pr.user_id=$1
        `,
        [userId]
    )

    res.json(progress.rows)
}

exports.getUserStats = async (req,res)=>{

    const userId = req.userId

    try {
        const progressStats = await pool.query(
            `
            SELECT COUNT(*) FROM progress 
            WHERE user_id=$1 AND status='Solved'
            `,
            [userId]
        )

        const submissionStats = await pool.query(
            `
            SELECT COUNT(*) FROM submissions 
            WHERE user_id=$1
            `,
            [userId]
        )

        res.json({
            problemsSolved: parseInt(progressStats.rows[0].count),
            submissions: parseInt(submissionStats.rows[0].count),
            sheetsCompleted: 0,
            currentStreak: 0
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}