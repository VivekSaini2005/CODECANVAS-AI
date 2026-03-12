const pool = require("../config/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.register = async(req,res)=>{
    try{

        const {username,email,password} = req.body

        const hashed = await bcrypt.hash(password,10)

        const user = await pool.query(
            "INSERT INTO users(username,email,password) VALUES($1,$2,$3) RETURNING *",
            [username,email,hashed]
        )

        res.json(user.rows[0])

    }catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.login = async(req,res)=>{
    try{

        const {email,password} = req.body

        const user = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        )

        if(user.rows.length===0)
            return res.status(400).json({msg:"User not found"})

        const valid = await bcrypt.compare(password,user.rows[0].password)

        if(!valid)
            return res.status(400).json({msg:"Wrong password"})

        const token = jwt.sign(
            {id:user.rows[0].id},
            process.env.JWT_SECRET
        )

        res.json({"Login Successfully":"Congrulations",token})

    }catch(err){
        res.status(500).json({error:err.message})
    }
}