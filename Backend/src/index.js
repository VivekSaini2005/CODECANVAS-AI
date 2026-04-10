const express = require("express")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/authRoutes")
const problemRoutes = require("./routes/problemRoutes")
const sheetRoutes = require("./routes/sheetRoutes")
const progressRoutes = require("./routes/progressRoutes")
const submissionRoutes = require("./routes/submissionRoutes")
const platformStatsRoutes = require("./routes/platformStats")
const runcode = require("./routes/compilerRoute")
const cookieParser = require("cookie-parser")
const aiRoutes = require("./routes/aiRoutes")
const userRoute = require("./routes/userRoutes")
const dicussionRoute = require("./routes/discussRoute")
const notificationRoute = require("./routes/notificationRoute")


const http = require("http");
const { Server } = require("socket.io");
const { setupSocket } = require("./socket");

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this in production
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});
app.set("io", io); // Make io available in controllers if needed
setupSocket(io);

app.use(cookieParser())
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/problems", problemRoutes)
app.use("/api/sheets", sheetRoutes)
app.use("/api/progress", progressRoutes)
app.use("/api/submissions", submissionRoutes)
app.use("/api/stats", platformStatsRoutes)
app.use("/api/run", runcode)
app.use("/api/ai", aiRoutes)
app.use("/api/user",userRoute)
app.use("/api/discussions",dicussionRoute)
app.use("/api/notifications",notificationRoute)


const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})