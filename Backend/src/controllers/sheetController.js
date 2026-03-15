const pool = require("../config/db")

// =====================================
// GET ALL SHEETS
// =====================================

exports.getSheets = async (req, res) => {

    try {

        const sheets = await pool.query(
            "SELECT * FROM sheets ORDER BY created_at DESC"
        )

        res.json(sheets.rows)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }

}



// =====================================
// CREATE NEW SHEET
// =====================================

exports.createSheet = async (req, res) => {

    try {

        const { name, description } = req.body

        const sheet = await pool.query(
            `
            INSERT INTO sheets(name,description)
            VALUES($1,$2)
            RETURNING *
            `,
            [name, description]
        )

        res.json(sheet.rows[0])

    } catch (err) {
        res.status(500).json({ error: err.message })
    }

}



// =====================================
// GET PROBLEMS OF A SHEET
// =====================================

exports.getSheetProblems = async (req, res) => {

    try {

        const { id } = req.params

        const problems = await pool.query(
            `
            SELECT 
                p.id,
                p.title,
                p.slug,
                p.link,
                p.platform,
                p.difficulty,
                sp.order_index
            FROM problems p
            JOIN sheet_problems sp
            ON sp.problem_id = p.id
            WHERE sp.sheet_id = $1
            ORDER BY sp.order_index ASC
            `,
            [id]
        )

        res.json(problems.rows)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }

}