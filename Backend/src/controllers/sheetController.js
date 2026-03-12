const pool = require("../config/db")

exports.getSheets = async(req,res)=>{
    try{

        const sheets = await pool.query("SELECT * FROM sheets")

        res.json(sheets.rows)

    }catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.getSheetProblems = async(req,res)=>{
    try{

        const {sheetId} = req.params

        const problems = await pool.query(
        `SELECT p.*
         FROM sheet_problems sp
         JOIN problems p
         ON sp.problem_id = p.id
         WHERE sp.sheet_id = $1
         ORDER BY sp.problem_order`,
        [sheetId]
        )

        res.json(problems.rows)

    }catch(err){
        res.status(500).json({error:err.message})
    }
}