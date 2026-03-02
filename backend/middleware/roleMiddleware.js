// roleMiddleware.js

const isAdmin = (req, res, next) => {
  // req.user is added by verifyToken middleware
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Admins only",
    });
  }

  next(); // user is admin, allow access
};

module.exports = isAdmin;