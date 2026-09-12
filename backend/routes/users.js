const express = require("express");
const User = require("../models/User");
const Item = require("../models/Item");
const Claim = require("../models/Claim");
const Notification = require("../models/Notification");
const { protect, securityHeadOnly, securityOnly } = require("../middleware/auth");

const router = express.Router();

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

router.get("/me/dashboard", protect, async (req, res) => {
  try {
    const id = req.user._id;
    const [lostReports, foundReports, resolvedItems, claims, notifications] = await Promise.all([
      Item.find({ user: id, type: "lost", status: { $ne: "removed" } }).sort({ createdAt: -1 }),
      Item.find({ user: id, type: "found", status: { $ne: "removed" } }).sort({ createdAt: -1 }),
      Item.countDocuments({ user: id, status: "resolved" }),
      Claim.find({ claimant: id }).populate("item").sort({ createdAt: -1 }),
      Notification.find({ user: id }).sort({ createdAt: -1 }).limit(30),
    ]);
    const activeClaims = claims.filter((c) =>
      ["pending", "under_review", "approved"].includes(c.status)
    ).length;
    res.json({
      stats: {
        lostReports: lostReports.length,
        foundReports: foundReports.length,
        activeClaims,
        resolvedItems,
      },
      lostReports,
      foundReports,
      claims,
      notifications,
    });
  } catch (err) {
    res.status(500).json({ error: "Unable to load dashboard." });
  }
});

router.put("/me", protect, async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    if (name) req.user.name = name.trim();
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Enter your current password to change it." });
      }
      const withPassword = await User.findById(req.user._id).select("+password");
      if (!(await withPassword.comparePassword(currentPassword))) {
        return res.status(400).json({ error: "Current password is incorrect." });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ error: "New password must be at least 8 characters." });
      }
      withPassword.name = req.user.name;
      withPassword.password = newPassword;
      await withPassword.save();
      await Notification.notify(req.user._id, "account", "Your password was updated.", "#/dashboard");
      return res.json({ user: withPassword.toPublic() });
    }
    await req.user.save();
    res.json({ user: req.user.toPublic() });
  } catch (err) {
    res.status(500).json({ error: "Unable to update profile." });
  }
});

// Security Head Overview Statistics
router.get("/stats", protect, securityOnly, async (_req, res) => {
  try {
    const [totalUsers, totalSubSecurities, lostReports, foundReports, pendingClaims, resolvedItems] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "sub_security" }),
        Item.countDocuments({ type: "lost", status: { $ne: "removed" } }),
        Item.countDocuments({ type: "found", status: { $ne: "removed" } }),
        Claim.countDocuments({ status: { $in: ["pending", "under_review"] } }),
        Item.countDocuments({ status: "resolved" }),
      ]);
    res.json({
      stats: {
        totalUsers,
        totalSubSecurities,
        lostReports,
        foundReports,
        pendingClaims,
        resolvedItems,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Unable to load statistics." });
  }
});

// Security Head - Create Sub Security
router.post("/sub-security", protect, securityHeadOnly, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }
    const cleanEmail = email.toLowerCase().trim();
    if (!isEmail(cleanEmail)) {
      return res.status(400).json({ error: "Enter a valid email address." });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }
    const exists = await User.findOne({ email: cleanEmail });
    if (exists) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
    const subSecurity = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: "sub_security",
      userType: null,
      status: "active",
      active: true,
    });
    res.status(201).json({ user: subSecurity.toPublic() });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
    res.status(500).json({ error: "Unable to create Sub Security account." });
  }
});

// Security Head - List Sub Securities
router.get("/sub-security", protect, securityHeadOnly, async (_req, res) => {
  try {
    const subSecurities = await User.find({ role: "sub_security" }).sort({ createdAt: -1 });
    res.json({ users: subSecurities.map((u) => u.toPublic()) });
  } catch (err) {
    res.status(500).json({ error: "Unable to load Sub Security accounts." });
  }
});

// Security Head - Update Sub Security Status (Enable / Disable)
router.put("/sub-security/:id/status", protect, securityHeadOnly, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: "sub_security" });
    if (!user) {
      return res.status(404).json({ error: "Sub Security account not found." });
    }
    let nextStatus = req.body.status;
    if (typeof req.body.active === "boolean") {
      nextStatus = req.body.active ? "active" : "disabled";
    }
    if (!["active", "disabled"].includes(nextStatus)) {
      return res.status(400).json({ error: "Status must be 'active' or 'disabled'." });
    }
    user.status = nextStatus;
    user.active = nextStatus === "active";
    await user.save();
    if (nextStatus === "disabled") {
      await Notification.notify(
        user._id,
        "account",
        "Your Sub Security account was disabled by the Security Head.",
        ""
      );
    }
    res.json({ user: user.toPublic() });
  } catch (err) {
    res.status(500).json({ error: "Unable to update Sub Security status." });
  }
});

// Security Head - Remove Sub Security
router.delete("/sub-security/:id", protect, securityHeadOnly, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: "sub_security" });
    if (!user) {
      return res.status(404).json({ error: "Sub Security account not found." });
    }
    await User.findByIdAndDelete(user._id);
    res.json({ ok: true, message: "Sub Security account removed." });
  } catch (err) {
    res.status(500).json({ error: "Unable to remove Sub Security account." });
  }
});

// Security Head - List all users
router.get("/", protect, securityHeadOnly, async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users: users.map((u) => u.toPublic()) });
  } catch (err) {
    res.status(500).json({ error: "Unable to load users." });
  }
});

// Security Head - Update user
router.put("/:id", protect, securityHeadOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    if (String(user._id) === String(req.user._id) && (req.body.active === false || req.body.status === "disabled")) {
      return res.status(400).json({ error: "You cannot disable your own account." });
    }
    if (req.body.role === "security_head") {
      return res.status(400).json({ error: "Cannot assign Security Head role." });
    }
    if (["user", "sub_security", "admin"].includes(req.body.role)) {
      user.role = req.body.role;
    }
    if (req.body.status === "active" || req.body.status === "disabled") {
      user.status = req.body.status;
      user.active = req.body.status === "active";
    } else if (typeof req.body.active === "boolean") {
      user.active = req.body.active;
      user.status = req.body.active ? "active" : "disabled";
    }
    await user.save();
    if (user.status === "disabled" || user.active === false) {
      await Notification.notify(user._id, "account", "Your account was disabled by an administrator.", "");
    }
    res.json({ user: user.toPublic() });
  } catch (err) {
    res.status(500).json({ error: "Unable to update user." });
  }
});

// Security Head - Permanently delete user (not self, not another security head)
router.delete("/:id", protect, securityHeadOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    if (String(user._id) === String(req.user._id)) {
      return res.status(400).json({ error: "You cannot delete your own account." });
    }
    if (user.role === "security_head" || user.role === "admin") {
      return res.status(400).json({ error: "Cannot delete a Security Head account." });
    }
    await User.findByIdAndDelete(user._id);
    res.json({ ok: true, message: "Account deleted." });
  } catch (err) {
    res.status(500).json({ error: "Unable to delete account." });
  }
});

module.exports = router;
