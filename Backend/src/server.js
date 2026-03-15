const express = require("express")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/authRoutes")
const problemRoutes = require("./routes/problemRoutes")
const sheetRoutes = require("./routes/sheetRoutes")
const progressRoutes = require("./routes/progressRoutes")
const submissionRoutes = require("./routes/submissionRoutes")
const cookieParser = require("cookie-parser")


const app = express()

app.use(cookieParser())
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/problems", problemRoutes)
app.use("/api/sheets", sheetRoutes)
app.use("/api/progress", progressRoutes)
app.use("/api/submissions", submissionRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})