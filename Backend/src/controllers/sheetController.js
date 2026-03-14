const pool = require("../config/db")

exports.getSheets = async (req,res)=>{
    
    const sheets = await pool.query(
        "SELECT * FROM sheets ORDER BY created_at DESC"
    )

    res.json(sheets.rows)
}


exports.createSheet = async (req,res)=>{

    const {name,description} = req.body

    const sheet = await pool.query(
        `
        INSERT INTO sheets(name,description)
        VALUES($1,$2)
        RETURNING *
        `,
        [name,description]
    )

    res.json(sheet.rows[0])
}


exports.getSheetProblems = async (req,res)=>{

    const {id} = req.params

    const problems = await pool.query(
        `
        SELECT p.*
        FROM problems p
        JOIN sheet_problem sp
        ON sp.problem_id = p.id
        WHERE sp.sheet_id=$1
        ORDER BY sp.order ASC
        `,
        [id]
    )

    res.json(problems.rows)
}