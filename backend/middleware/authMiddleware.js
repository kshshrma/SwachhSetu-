const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // 1. Read Authorization header
  const authHeader = req.headers.authorization;

  // 2. Check if header exists
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  // 3. Extract token from "Bearer <token>"
  const token = authHeader.split(" ")[1];

  try {
    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach user info to request
    req.user = decoded;

    // 6. Allow request to continue
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = verifyToken;