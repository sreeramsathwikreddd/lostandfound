const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/auth");

const router = express.Router();

const BENNETT_DOMAIN = "@bennett.edu.in";

function signToken(user) {
  const role = user.role === "admin" ? "security_head" : user.role;

  return jwt.sign(
    {
      id: user._id,
      role,
      userType: user.userType || null,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isBennettEmail(email) {
  return email.toLowerCase().endsWith(BENNETT_DOMAIN);
}

function getEffectiveRole(user) {
  return user.role === "admin" ? "security_head" : user.role;
}

/*
 * Normal Student/Employee registration.
 * Security Head and Sub Security accounts cannot be created here.
 */
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      userType,
    } = req.body;

    if (!name || !email || !password || !confirmPassword || !userType) {
      return res.status(400).json({
        error: "All fields are required.",
      });
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).toLowerCase().trim();
    const cleanUserType = String(userType).toLowerCase().trim();

    if (cleanName.length < 2 || cleanName.length > 80) {
      return res.status(400).json({
        error: "Enter a valid name.",
      });
    }

    if (!isEmail(cleanEmail)) {
      return res.status(400).json({
        error: "Enter a valid email address.",
      });
    }

    if (!isBennettEmail(cleanEmail)) {
      return res.status(400).json({
        error: "Only @bennett.edu.in email addresses are allowed to register.",
      });
    }

    const securityHeadEmail = String(
      process.env.SECURITY_HEAD_EMAIL || ""
    )
      .toLowerCase()
      .trim();

    if (securityHeadEmail && cleanEmail === securityHeadEmail) {
      return res.status(403).json({
        error: "This email is reserved for the Security Head account.",
      });
    }

    if (!["student", "employee"].includes(cleanUserType)) {
      return res.status(400).json({
        error: "Please select whether you are a Student or an Employee.",
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Passwords do not match.",
      });
    }

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password,
      role: "user",
      userType: cleanUserType,
      status: "active",
      active: true,
    });

    try {
      await Notification.notify(
        user._id,
        "account",
        "Welcome to Lost & Found. Your account is ready.",
        "#/dashboard"
      );
    } catch (notificationError) {
      console.error(
        "Welcome notification error:",
        notificationError.message
      );
    }

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: user.toPublic(),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: "An account with this email already exists.",
      });
    }

    console.error("Registration error:", err.message);

    return res.status(500).json({
      error: "Unable to register. Try again.",
    });
  }
});

/*
 * Single login endpoint for:
 * - Security Head
 * - Sub Security
 * - Student
 * - Employee
 */
router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .toLowerCase()
      .trim();

    const password =
      typeof req.body.password === "string"
        ? req.body.password
        : "";

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    if (!isEmail(email)) {
      return res.status(400).json({
        error: "Enter a valid email address.",
      });
    }

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const role = getEffectiveRole(user);

    /*
     * Disabled accounts cannot sign in.
     */
    if (user.status === "disabled" || user.active === false) {
      return res.status(403).json({
        error: "This account has been disabled.",
      });
    }

    /*
     * Only the configured Security Head email can use
     * the Security Head access level.
     */
    if (role === "security_head") {
      const configuredHeadEmail = String(
        process.env.SECURITY_HEAD_EMAIL || ""
      )
        .toLowerCase()
        .trim();

      if (!configuredHeadEmail || email !== configuredHeadEmail) {
        return res.status(403).json({
          error: "Security Head access is not available for this account.",
        });
      }
    }

    /*
     * Student/Employee accounts must use Bennett email.
     */
    if (role === "user" && !isBennettEmail(email)) {
      return res.status(403).json({
        error:
          "Only @bennett.edu.in accounts can sign in as Student or Employee.",
      });
    }

    /*
     * Only these three access levels are allowed
     * through the application login.
     */
    if (
      !["user", "sub_security", "security_head"].includes(role)
    ) {
      return res.status(403).json({
        error: "This account does not have a valid access level.",
      });
    }

    const passwordMatches = await user.comparePassword(password);

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    /*
     * Convert legacy admin accounts to the effective
     * Security Head role in the JWT without changing
     * existing database data automatically.
     */
    const token = signToken(user);

    return res.json({
      token,
      user: {
        ...user.toPublic(),
        role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);

    return res.status(500).json({
      error: "Unable to sign in. Try again.",
    });
  }
});

/*
 * Return the currently authenticated user.
 */
router.get("/me", protect, (req, res) => {
  const role = getEffectiveRole(req.user);

  res.json({
    user: {
      ...req.user.toPublic(),
      role,
    },
  });
});

module.exports = router;