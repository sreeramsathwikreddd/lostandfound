require("dotenv").config({
  path: require("path").join(__dirname, "../.env"),
});

const path = require("path");
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");

const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");
const userRoutes = require("./routes/users");
const claimRoutes = require("./routes/claims");
const notificationRoutes = require("./routes/notifications");

const app = express();

const PORT = process.env.PORT || 5000;

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error("MONGODB_URI and JWT_SECRET must be set in .env");
  process.exit(1);
}

app.use(cors({ origin: true, credentials: false }));

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use("/uploads", express.static(uploadDir));

app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api", (_req, res) => {
  res.status(404).json({
    error: "Not found.",
  });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use((err, _req, res, _next) => {
  console.error("Server error:", err.message);

  res.status(500).json({
    error: err.message || "Server error.",
  });
});

/*
 * Ensure exactly one configured Security Head account exists.
 *
 * The credentials come from .env.
 * The password is hashed automatically by the User model.
 *
 * Existing user data is not deleted or reset.
 */
async function seedSecurityHead() {
  const email = String(process.env.SECURITY_HEAD_EMAIL || "")
    .toLowerCase()
    .trim();

  const password = process.env.SECURITY_HEAD_PASSWORD;

  if (!email || !password) {
    console.warn(
      "SECURITY_HEAD_EMAIL and SECURITY_HEAD_PASSWORD are not configured."
    );
    return;
  }

  const existing = await User.findOne({
    email,
  }).select("+password");

  if (existing) {
    let changed = false;

    if (existing.role !== "security_head") {
      existing.role = "security_head";
      changed = true;
    }

    if (existing.userType !== null) {
      existing.userType = null;
      changed = true;
    }

    if (existing.status !== "active") {
      existing.status = "active";
      changed = true;
    }

    if (existing.active !== true) {
      existing.active = true;
      changed = true;
    }

    if (changed) {
      await existing.save();
    }

    console.log("Security Head account ready:", email);
    return;
  }

  await User.create({
    name: "Security Head",
    email,
    password,
    role: "security_head",
    userType: null,
    status: "active",
    active: true,
  });

  console.log("Security Head account created:", email);
}

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log("MongoDB connected.");

    await seedSecurityHead();

    app.listen(PORT, () => {
      console.log(
        `Lost & Found running on http://localhost:${PORT}`
      );
    });
  } catch (err) {
    console.error("Failed to start:", err.message);
    process.exit(1);
  }
}

start();