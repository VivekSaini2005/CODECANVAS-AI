const pool = require("../config/db")

exports.getProblems = async(req,res)=>{
    try{

        const problems = await pool.query("SELECT * FROM problems")

        res.json(problems.rows)

    }catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.getProblem = async(req,res)=>{
    try{

        const {id} = req.params

        const problem = await pool.query(
            "SELECT * FROM problems WHERE id=$1",
            [id]
        )

        res.json(problem.rows[0])

    }catch(err){
        res.status(500).json({error:err.message})
    }
}