const pool = require("../config/db")
const { v4: uuidv4 } = require("uuid")

// =====================================
// GET ALL PROBLEMS
// =====================================

exports.getProblems = async (req, res) => {
  try {

    const { difficulty, tag } = req.query

    let query = `
      SELECT 
        p.*,
        ARRAY_AGG(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL) AS companies,
        (ARRAY_AGG(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL))[1] AS sheet
      FROM problems p
      LEFT JOIN problem_companies pc ON pc.problem_id = p.id
      LEFT JOIN companies c ON c.id = pc.company_id
      LEFT JOIN sheet_problems sp ON sp.problem_id = p.id
      LEFT JOIN sheets s ON s.id = sp.sheet_id
    `

    const values = []
    let conditions = []

    if (tag) {
      query += `
        JOIN problem_tags pt ON pt.problem_id = p.id
        JOIN tags t ON t.id = pt.tag_id
      `
      conditions.push(`t.name = $${values.length + 1}`)
      values.push(tag)
    }

    if (difficulty) {
      conditions.push(`p.difficulty = $${values.length + 1}`)
      values.push(difficulty)
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ")
    }

    query += ` GROUP BY p.id`

    const problems = await pool.query(query, values)

    res.json(problems.rows)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// GET SINGLE PROBLEM BY SLUG


exports.getProblem = async (req, res) => {

  try {

    const { slug } = req.params


    // GET PROBLEM


    const problem = await pool.query(
      `SELECT id, title, slug, difficulty, platform, link
       FROM problems
       WHERE slug = $1`,
      [slug]
    )

    if (problem.rows.length === 0) {
      return res.status(404).json({ msg: "Problem not found" })
    }

    const problemId = problem.rows[0].id


    // GET TAGS


    const tags = await pool.query(`
      SELECT t.name
      FROM tags t
      JOIN problem_tags pt
      ON pt.tag_id = t.id
      WHERE pt.problem_id = $1
    `, [problemId])

    // GET COMPANIES

    const companies = await pool.query(`
      SELECT c.name
      FROM companies c
      JOIN problem_companies pc
      ON pc.company_id = c.id
      WHERE pc.problem_id = $1
    `, [problemId])


    // RESPONSE

    res.json({
      problem: problem.rows[0],
      tags: tags.rows.map(t => t.name),
      companies: companies.rows.map(c => c.name),
      link: problem.rows[0].link
    })

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


// =====================================
// CREATE PROBLEM
// =====================================

exports.createProblem = async (req, res) => {

  try {

    const {
      title,
      slug,
      difficulty,
      link,
      platform
    } = req.body

    const problem = await pool.query(
      `
      INSERT INTO problems
      (id, title, slug, difficulty, link, platform)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [uuidv4(), title, slug, difficulty, link, platform]
    )

    res.json(problem.rows[0])

  } catch (error) {
    res.status(500).json({ error: error.message })
  }

}

exports.getRecommendedProblems = async (req, res) => {

  try {

    const userId = req.userId

    const result = await pool.query(
      `
      SELECT 
          p.id,
          p.title,
          p.slug,
          p.difficulty

      FROM problems p

      LEFT JOIN user_solved_problems usp
      ON usp.problem_id = p.id
      AND usp.user_id = $1

      WHERE usp.problem_id IS NULL

      ORDER BY RANDOM()

      LIMIT 3
      `,
      [userId]
    )

    res.json(result.rows)

  } catch (err) {

    console.error(err)
    res.status(500).json({ error: "Server Error" })

  }

}

exports.getRecentProblems = async (req, res) => {

  try {

    const userId = req.userId

    const result = await pool.query(
      `
      SELECT 
          p.id,
          p.title,
          p.slug,
          p.difficulty,
          usp.solved_at

      FROM user_solved_problems usp

      JOIN problems p
      ON p.id = usp.problem_id

      WHERE usp.user_id = $1

      ORDER BY usp.solved_at DESC
      `,
      [userId]
    )

    res.json(result.rows)

  } catch (err) {

    console.error(err)
    res.status(500).json({ error: "Server Error" })

  }

}