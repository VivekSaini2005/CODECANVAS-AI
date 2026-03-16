const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {

  let token = req.cookies.token;
  // console.log(token)

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    // console.log(req.userId);
    next()
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" })
  }
}