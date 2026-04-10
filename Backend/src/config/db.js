const { Pool } = require("pg")
require("dotenv").config();


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

// const pool = new Pool({
//   host: "db.bbpfxohrermiztsvikbe.supabase.co",
//   user: "postgres",
//   password: "@Abhishek2005@", 
//   database: "postgres",
//   port: 5432,
//   ssl: { rejectUnauthorized: false },
// });

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "CODECANVAS_AI",
//   password: process.env.DB_PASSWORD,
//   port: 5432,
// })
module.exports = pool