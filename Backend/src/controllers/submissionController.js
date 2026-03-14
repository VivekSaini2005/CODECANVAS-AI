const pool = require("../config/db")

exports.createSubmission = async (req,res)=>{

    const userId = req.userId
    const {problemId,code,language,status} = req.body

    const submission = await pool.query(
        `
        INSERT INTO submissions
        (user_id,problem_id,code,language,status)
        VALUES($1,$2,$3,$4,$5)
        RETURNING *
        `,
        [userId,problemId,code,language,status]
    )

    res.json(submission.rows[0])
}


exports.getUserSubmissions = async (req,res)=>{

    const userId = req.userId

    const submissions = await pool.query(
        `
        SELECT s.*, p.title
        FROM submissions s
        JOIN problems p
        ON s.problem_id=p.id
        WHERE s.user_id=$1
        `,
        [userId]
    )

    res.json(submissions.rows)
}