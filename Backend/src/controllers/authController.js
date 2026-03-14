const pool = require("../config/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")

exports.register = async (req, res) => {
    try {

        const { name, email, password } = req.body

        const hashed = await bcrypt.hash(password, 10)

        const user = await pool.query(
            "INSERT INTO users(id,name,email,password) VALUES($1,$2,$3,$4) RETURNING *",
            [uuidv4(),name, email, hashed]
        )

        const token = jwt.sign(
            { id: user.rows[0].id },
            process.env.JWT_SECRET
        )

        res.json({ user: user.rows[0], token })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.getMe = async (req, res) => {
    try {
        const user = await pool.query(
            'SELECT id, name, email FROM users WHERE id=$1',
            [req.userId]
        )

        if (user.rows.length === 0)
            return res.status(404).json({ msg: "User not found" })

        res.json(user.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body

        const user = await pool.query(
            'SELECT * FROM users WHERE email=$1',
            [email]
        )

        if (user.rows.length === 0)
            return res.status(400).json({ msg: "User not found" })

        const valid = await bcrypt.compare(password, user.rows[0].password)

        if (!valid)
            return res.status(400).json({ msg: "Wrong password" })

        const token = jwt.sign(
            { id: user.rows[0].id },
            process.env.JWT_SECRET
        )

        res.json({ "Login Successfully": "Congrulations", token })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}