const express = require("express")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/authRoutes")
const problemRoutes = require("./routes/problemRoutes")
const sheetRoutes = require("./routes/sheetRoutes")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/problems", problemRoutes)
app.use("/api/sheets", sheetRoutes)

app.get("/", (req,res)=>{
    res.send("CodeCanvas Backend Running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
})