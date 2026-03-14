const pool = require("../config/db")
const { v4: uuidv4 } = require("uuid")

exports.getProblems = async (req, res) => {
  try {

    const { difficulty, tag } = req.query

    let query = `
      SELECT * FROM problems
    `

    if (difficulty) {
      query += ` WHERE difficulty = '${difficulty}'`
    }

    const problems = await pool.query(query)

    res.json(problems.rows)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


exports.getProblem = async (req, res) => {

  try {

    const { slug } = req.params

    const problem = await pool.query(
      `SELECT * FROM problems WHERE slug=$1`,
      [slug]
    )

    if (problem.rows.length === 0)
      return res.status(404).json({ msg: "Problem not found" })

    const tags = await pool.query(`
      SELECT t.name
      FROM tags t
      JOIN problem_tag pt ON pt.tag_id = t.id
      JOIN problems p ON p.id = pt.problem_id
      WHERE p.slug=$1
    `,[slug])

    res.json({
      problem: problem.rows[0],
      tags: tags.rows
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }

}


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
      (id,title,slug,difficulty,"problemLink",platform)
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [uuidv4(),title, slug, difficulty, link, platform]
    )

    res.json(problem.rows[0])

  } catch (error) {
    res.status(500).json({ error: error.message })
  }

}