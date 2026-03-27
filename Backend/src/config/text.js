const pool = require("./db")

async function getUsers(){
    const res = await pool.query("SELECT * FROM users LIMIT 5")
    console.log(res.rows);
}

getUsers();