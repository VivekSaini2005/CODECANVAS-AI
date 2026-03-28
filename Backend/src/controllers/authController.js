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
            [uuidv4(), name, email, hashed]
        )

        const token = jwt.sign(
            { id: user.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production (https)
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({ user: user.rows[0], token: token })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.getMe = async (req, res) => {
    try {
        const user = await pool.query(
            'SELECT id, name, email, leetcode_username, codeforces_username, codechef_username, profileimage FROM users WHERE id=$1',
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
            "SELECT * FROM users WHERE email=$1",
            [email]
        )

        if (user.rows.length === 0)
            return res.status(400).json({ msg: "User not found" })

        const valid = await bcrypt.compare(password, user.rows[0].password)

        if (!valid)
            return res.status(400).json({ msg: "Wrong password" })

        const token = jwt.sign(
            { id: user.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({ message: "Login successful", token: token, user: user.rows[0] })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.updateProfile = async (req, res) => {
    try {

        const { leetcode_username, codeforces_username, codechef_username, name } = req.body

        const user = await pool.query(
            "UPDATE users SET leetcode_username=$1, codeforces_username=$2, codechef_username=$3, name=$4 WHERE id=$5 RETURNING *",
            [leetcode_username, codeforces_username, codechef_username, name, req.userId]
        )

        if (user.rows.length === 0)
            return res.status(400).json({ msg: "User not found" })

        res.json({ message: "Profile updated successfully", user: user.rows[0] })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');

exports.googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        
        if (!credential) {
            return res.status(400).json({ error: "No credential provided" });
        }

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        const { email, name } = payload;

        let userResult = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        let user;

        if (userResult.rows.length === 0) {
            const randomPassword = crypto.randomBytes(8).toString('hex');
            const hashed = await bcrypt.hash(randomPassword, 10);
            
            const insertResult = await pool.query(
                "INSERT INTO users(id, name, email, password) VALUES($1, $2, $3, $4) RETURNING *",
                [uuidv4(), name, email, hashed]
            );
            user = insertResult.rows[0];
        } else {
            user = userResult.rows[0];
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ message: "Login successful", token: token, user: user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
