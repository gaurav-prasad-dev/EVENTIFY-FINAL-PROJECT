const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ✅ import user model

const getTokenFromReq = (req) => {
  if (req.cookies?.accessToken) return req.cookies.accessToken;
  if (req.cookies?.accesstoken) return req.cookies.accesstoken;
  if (req.cookies?.token) return req.cookies.token;
  if (req.headers.authorization) {
    const authHeader = req.headers.authorization;
    return authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
  }
  return null;
};

exports.auth = async (req, res, next) => {
  try {
    const token = getTokenFromReq(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // ✅ verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ fetch user from DB
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ check blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
      });
    }

    req.user = {
      id: user._id,
      _id: user._id,
      role: user.role,
      isApproved: user.isApproved,
    };

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "ACCESS_TOKEN_EXPIRED",
    });
  }
};

exports.optionalAuth = async (req, res, next) => {
  try {
    const token = getTokenFromReq(req);

    if (!token) {
      return next();
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (verifyErr) {
      decoded = jwt.decode(token);
    }

    if (decoded?.id) {
      const user = await User.findById(decoded.id);

      if (user && !user.isBlocked) {
        req.user = {
          id: user._id,
          _id: user._id,
          role: user.role,
          isApproved: user.isApproved,
        };
      }
    }
    next();
  } catch (err) {
    next();
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admins only",
    });
  }

  next();
};

exports.isOrganizer = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (
      !["organizer", "admin"].includes(req.user.role) ||
      (req.user.role === "organizer" && !req.user.isApproved)
    ) {
      return res.status(403).json({ // ✅ fixed typo
        success: false,
        message: "Organizer requires admin approval",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking organizer role",
    });
  }
};