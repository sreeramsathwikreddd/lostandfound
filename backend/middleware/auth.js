const jwt = require("jsonwebtoken");
const User = require("../models/User");

function getEffectiveRole(role) {
  return role === "admin" ? "security_head" : role;
}

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required.",
      });
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        error: "Authentication required.",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        error: "Your session is invalid or has expired. Please log in again.",
      });
    }

    if (!decoded.id) {
      return res.status(401).json({
        error: "Invalid authentication token.",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        error: "Account not found. Please log in again.",
      });
    }

    const role = getEffectiveRole(user.role);

    if (user.status === "disabled" || user.active === false) {
      return res.status(403).json({
        error: "This account has been disabled.",
      });
    }

    req.user = user;
    req.userRole = role;

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error.message);

    return res.status(500).json({
      error: "Unable to verify authentication.",
    });
  }
}

function authorize(...allowedRoles) {
  const normalizedRoles = allowedRoles.map(getEffectiveRole);

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required.",
      });
    }

    const currentRole = getEffectiveRole(req.user.role);

    if (!normalizedRoles.includes(currentRole)) {
      return res.status(403).json({
        error: "You do not have permission to access this resource.",
      });
    }

    next();
  };
}

function securityHeadOnly(req, res, next) {
  return authorize("security_head")(req, res, next);
}

function securityOnly(req, res, next) {
  return authorize("security_head", "sub_security")(req, res, next);
}

function userOnly(req, res, next) {
  return authorize("user")(req, res, next);
}

function adminOnly(req, res, next) {
  return securityHeadOnly(req, res, next);
}

/*
 * Used by existing item routes.
 *
 * Authentication is optional:
 * - No token: continue as a public request.
 * - Valid token: attach the current user.
 * - Invalid/expired token: continue without authentication.
 *
 * This must never block public Lost & Found browsing.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
    if (error || !decoded || !decoded.id) {
      return next();
    }

    try {
      const user = await User.findById(decoded.id);

      if (
        user &&
        user.status !== "disabled" &&
        user.active !== false
      ) {
        req.user = user;
        req.userRole = getEffectiveRole(user.role);
      }
    } catch (lookupError) {
      console.error(
        "Optional authentication lookup error:",
        lookupError.message
      );
    }

    next();
  });
}

module.exports = {
  protect,
  authorize,
  securityHeadOnly,
  securityOnly,
  userOnly,
  adminOnly,
  optionalAuth,
};