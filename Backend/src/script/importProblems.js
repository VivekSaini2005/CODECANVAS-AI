const pool = require("../config/db")
// require("dotenv").config();
// console.log(process.env.DATABASE_URL);
const { v4: uuidv4 } = require("uuid")

const problems = [
  {
    title:"Two Sum",
    slug:"two-sum",
    difficulty:"Easy",
    link:"https://leetcode.com/problems/two-sum",
    paltform:"leetcode"
  },
  {
    title:"Longest Substring Without Repeating Characters",
    slug:"longest-substring",
    difficulty:"Medium",
    link:"https://leetcode.com/problems/longest-substring-without-repeating-characters",
    platform:"leetcode"
  }
]


async function importProblems(){

  for(const p of problems){

    await pool.query(
      `
      INSERT INTO problems(id,title,slug,difficulty,"problemLink",platform)
      VALUES($1,$2,$3,$4,$5,$6)
      `,
      [uuidv4(),p.title,p.slug,p.difficulty,p.link,p.platform]
    )

  }

  console.log("Problems imported")
}

importProblems()