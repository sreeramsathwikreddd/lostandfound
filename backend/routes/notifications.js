const express = require("express");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    const unread = await Notification.countDocuments({ user: req.user._id, read: false });
    res.json({ notifications, unread });
  } catch (err) {
    res.status(500).json({ error: "Unable to load notifications." });
  }
});

router.put("/read-all", protect, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Unable to update notifications." });
  }
});

router.put("/:id/read", protect, async (req, res) => {
  try {
    const note = await Notification.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ error: "Notification not found." });
    note.read = true;
    await note.save();
    res.json({ notification: note });
  } catch (err) {
    res.status(500).json({ error: "Unable to update notification." });
  }
});

module.exports = router;
