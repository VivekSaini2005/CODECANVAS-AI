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
    sp.order_index,
    ARRAY_AGG(c.name) AS company_tags

FROM problems p

JOIN sheet_problems sp
ON sp.problem_id = p.id

LEFT JOIN problem_companies pc
ON pc.problem_id = p.id

LEFT JOIN companies c
ON c.id = pc.company_id

WHERE sp.sheet_id = $1

GROUP BY
    p.id,
    p.title,
    p.slug,
    p.link,
    p.platform,
    p.difficulty,
    sp.order_index

ORDER BY sp.order_index ASC
            `,
            [id]
        )

        res.json(problems.rows)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }

}

exports.getSheetsProg = async (req, res) => {
    try {

        const userId = req.userId

        // console.log(userId);

        const sheets = await pool.query(
            `
      SELECT 
        s.id,
        s.name,
        s.description,

        COUNT(sp.problem_id) AS total_problems,

        COUNT(usp.problem_id) AS solved_problems,

        COALESCE(
          ROUND(
            COUNT(usp.problem_id)::decimal /
            NULLIF(COUNT(sp.problem_id),0) * 100
          ),0
        ) AS progress

      FROM sheets s

      LEFT JOIN sheet_problems sp
        ON sp.sheet_id = s.id

      LEFT JOIN user_solved_problems usp
        ON usp.problem_id = sp.problem_id
        AND usp.user_id = $1

      GROUP BY s.id
      ORDER BY s.id
      `,
            [userId]
        )

        res.json(sheets.rows)

    } catch (err) {

        console.error(err)
        res.status(500).json({ error: err.message })

    }
}

