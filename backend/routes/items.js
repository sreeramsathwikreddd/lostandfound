const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const Item = require("../models/Item");
const Notification = require("../models/Notification");
const Conversation = require("../models/Conversation");
const { protect, securityHeadOnly, securityOnly, optionalAuth } = require("../middleware/auth");

const router = express.Router();
const { CATEGORIES } = Item;

function sameUserId(a, b) {
  if (a == null || b == null) return false;
  const left = a._id != null ? a._id : a;
  const right = b._id != null ? b._id : b;
  return String(left) === String(right);
}


const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    cb(ok ? null : new Error("Only JPEG, PNG, or WebP images are allowed."), ok);
  },
});

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const STOP = new Set([
  "the", "and", "for", "with", "from", "that", "this", "lost", "found",
  "item", "near", "around", "black", "white", "small", "large",
]);

function tokens(text) {
  return String(text || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

function matchScore(a, b) {
  if (a.type === b.type) return 0;
  let score = 0;
  if (a.category && a.category === b.category) score += 3;
  const locA = (a.location || "").toLowerCase();
  const locB = (b.location || "").toLowerCase();
  if (locA && locB && (locA.includes(locB) || locB.includes(locA))) score += 2;
  const d1 = new Date(a.date);
  const d2 = new Date(b.date);
  if (!Number.isNaN(d1.getTime()) && !Number.isNaN(d2.getTime())) {
    if (Math.abs(d1 - d2) <= 7 * 24 * 60 * 60 * 1000) score += 2;
  }
  const setA = new Set(tokens(`${a.title} ${a.description} ${a.identifyingDetails}`));
  let overlap = 0;
  for (const t of tokens(`${b.title} ${b.description} ${b.identifyingDetails}`)) {
    if (setA.has(t)) overlap += 1;
  }
  score += Math.min(5, overlap);
  return score;
}

async function findMatches(item, limit) {
  const others = await Item.find({
    _id: { $ne: item._id },
    type: item.type === "lost" ? "found" : "lost",
    status: "open",
  }).populate("user", "name");
  return others
    .map((other) => ({ item: other, score: matchScore(item, other) }))
    .filter((row) => {
      if (row.score < 3) return false;
      // Never surface security-pending / rejected found items as matches
      if (row.item && row.item.type === "found" && !isFoundPubliclyVisible(row.item)) return false;
      return true;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit || 5);
}

function publicItem(item, extra) {
  const obj = typeof item.toObject === "function"
    ? item.toObject({ virtuals: false, depopulate: false })
    : { ...item };
  // Always surface custody fields (even if older schema omitted them)
  if (item.actionTaken !== undefined) obj.actionTaken = item.actionTaken;
  else if (obj.actionTaken === undefined) obj.actionTaken = "none";
  if (item.handover !== undefined) obj.handover = item.handover;
  const user = obj.user && obj.user.name
    ? { id: obj.user._id || obj.user.id, name: obj.user.name, email: obj.user.email }
    : obj.user;
  return { ...obj, id: obj._id || obj.id, user, ...extra };
}


function isFoundPubliclyVisible(item) {
  if (!item || item.type !== "found") return true;
  if (item.status === "removed") return false;
  const custody = item.foundCustody || {};
  const mode = String(custody.mode || "").toLowerCase();
  const status = String(custody.verificationStatus || "").toLowerCase();
  const visibility = String(custody.visibility || "").toLowerCase();

  // Submitted to Security: live ONLY when explicitly verified (never pending/rejected)
  if (mode === "security") {
    return status === "verified";
  }

  // Self custody: live immediately
  if (mode === "self" || status === "not_required") return true;

  // Any explicit non-public flag
  if (visibility === "pending" || visibility === "hidden") return false;
  if (status === "pending" || status === "rejected") return false;

  // Legacy found items with no custody record stay visible
  return true;
}

function isSecurityRole(user) {
  if (!user) return false;
  return ["security_head", "sub_security", "admin"].includes(String(user.role || ""));
}

function handleUpload(req, res, next) {
  // Skip multer for JSON so req.body is not wiped on custody / field updates
  const ct = String(req.headers["content-type"] || "");
  if (ct.includes("application/json")) {
    return next();
  }
  upload.single("image")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}



// ===== CUSTODY UPDATE (POST body, no path-param routing issues) =====
router.post("/custody-update", protect, async (req, res) => {
  try {
    const role = (req.userRole || (req.user && req.user.role) || "").toString();
    const okRole =
      role === "security_head" ||
      role === "sub_security" ||
      role === "admin" ||
      (req.user && ["security_head", "sub_security", "admin"].includes(String(req.user.role)));
    if (!okRole) {
      return res.status(403).json({ error: "Security access required." });
    }

    const itemId = (req.body && (req.body.id || req.body.itemId)) || "";
    const action = String((req.body && req.body.actionTaken) || "").trim();

    if (!itemId) {
      return res.status(400).json({ error: "Missing item id." });
    }
    if (!["none", "in_department", "submitted_to_owner"].includes(action)) {
      return res.status(400).json({
        error: "Invalid action. Use none, in_department, or submitted_to_owner.",
        received: req.body,
      });
    }

    const mongoose = require("mongoose");
    let oid;
    try {
      oid = new mongoose.Types.ObjectId(String(itemId));
    } catch (_e) {
      return res.status(400).json({ error: "Invalid item id." });
    }

    const existing = await Item.collection.findOne({ _id: oid });
    if (!existing || existing.status === "removed") {
      return res.status(404).json({ error: "Item not found." });
    }

    const notes = String((req.body && (req.body.notes || req.body.handoverNotes)) || "").trim();
    const ownerDetails = (req.body && req.body.ownerDetails) || null;
    const handover = {
      toName: "",
      notes,
      at: null,
      byName: (req.user && req.user.name) || "",
      by: req.user && req.user._id,
      ownerDetails: null,
    };
    let status = existing.status || "open";

    if (action === "none") {
      handover.byName = "";
      handover.by = null;
      handover.ownerDetails = null;
      if (status === "resolved") status = "open";
    } else if (action === "in_department") {
      handover.at = new Date();
      if (status === "resolved") status = "open";
    } else if (action === "submitted_to_owner") {
      const toName =
        String((req.body && req.body.toName) || "").trim() ||
        (ownerDetails && String(ownerDetails.name || "").trim()) ||
        "";
      if (!toName) {
        return res.status(400).json({
          error: "Enter the name of the person who received the item.",
        });
      }
      handover.toName = toName;
      handover.at = new Date();
      if (ownerDetails) handover.ownerDetails = ownerDetails;
      status = "resolved";
      try {
        await Notification.notify(
          existing.user,
          "returned",
          `Your item "${existing.title}" was submitted to ${toName}.`,
          `#/item/${existing._id}`
        );
      } catch (_e) {}
    }

    await Item.collection.updateOne(
      { _id: oid },
      { $set: { actionTaken: action, handover, status } }
    );

    const fresh = await Item.collection.findOne({ _id: oid });
    let user = null;
    try {
      const User = require("../models/User");
      if (fresh && fresh.user) {
        const u = await User.findById(fresh.user).select("name email").lean();
        if (u) user = { id: u._id, name: u.name, email: u.email };
      }
    } catch (_e) {}

    const item = {
      ...fresh,
      id: fresh._id,
      actionTaken: action,
      handover,
      status,
      user: user || fresh.user,
    };

    return res.json({ item: publicItem(item), ok: true, actionTaken: action });
  } catch (err) {
    console.error("custody-update error:", err);
    return res.status(500).json({ error: err.message || "Unable to update custody." });
  }
});

// Security lost-item custody (matches frontend: PUT /api/items/set-custody/:id)
router.put("/set-custody/:id", protect, async (req, res) => {
  try {
    const role = (req.userRole || (req.user && req.user.role) || "").toString();
    const okRole =
      role === "security_head" ||
      role === "sub_security" ||
      role === "admin" ||
      (req.user && ["security_head", "sub_security", "admin"].includes(String(req.user.role)));
    if (!okRole) {
      return res.status(403).json({ error: "Security access required." });
    }

    const itemId = req.params.id;
    const action = String((req.body && req.body.actionTaken) || "").trim();
    if (!itemId) {
      return res.status(400).json({ error: "Missing item id." });
    }
    if (!["none", "in_department", "submitted_to_owner"].includes(action)) {
      return res.status(400).json({
        error: "Invalid action. Use none, in_department, or submitted_to_owner.",
      });
    }

    const mongoose = require("mongoose");
    let oid;
    try {
      oid = new mongoose.Types.ObjectId(String(itemId));
    } catch (_e) {
      return res.status(400).json({ error: "Invalid item id." });
    }

    const existing = await Item.collection.findOne({ _id: oid });
    if (!existing || existing.status === "removed") {
      return res.status(404).json({ error: "Item not found." });
    }

    const notes = String((req.body && (req.body.notes || req.body.handoverNotes)) || "").trim();
    const ownerDetails = (req.body && req.body.ownerDetails) || null;
    const handover = {
      toName: "",
      notes,
      at: null,
      byName: (req.user && req.user.name) || "",
      by: req.user && req.user._id,
      ownerDetails: null,
    };
    let status = existing.status || "open";

    if (action === "none") {
      handover.byName = "";
      handover.by = null;
      if (status === "resolved") status = "open";
    } else if (action === "in_department") {
      handover.at = new Date();
      if (status === "resolved") status = "open";
    } else if (action === "submitted_to_owner") {
      const toName =
        String((req.body && req.body.toName) || "").trim() ||
        (ownerDetails && String(ownerDetails.name || "").trim()) ||
        "";
      if (!toName) {
        return res.status(400).json({
          error: "Enter the name of the person who received the item.",
        });
      }
      handover.toName = toName;
      handover.at = new Date();
      if (ownerDetails) handover.ownerDetails = ownerDetails;
      status = "resolved";
      try {
        await Notification.notify(
          existing.user,
          "returned",
          `Your item "${existing.title}" was submitted to ${toName}.`,
          `#/item/${existing._id}`
        );
      } catch (_e) {}
    }

    await Item.collection.updateOne(
      { _id: oid },
      { $set: { actionTaken: action, handover, status } }
    );

    const fresh = await Item.collection.findOne({ _id: oid });
    let user = null;
    try {
      const User = require("../models/User");
      if (fresh && fresh.user) {
        const u = await User.findById(fresh.user).select("name email").lean();
        if (u) user = { id: u._id, name: u.name, email: u.email };
      }
    } catch (_e) {}

    const item = {
      ...fresh,
      id: fresh._id,
      actionTaken: action,
      handover,
      status,
      user: user || fresh.user,
    };

    return res.json({ item: publicItem(item), ok: true, actionTaken: action });
  } catch (err) {
    console.error("set-custody error:", err);
    res.status(500).json({ error: err.message || "Unable to update custody." });
  }
});


router.get("/categories", (_req, res) => {
  res.json({ categories: CATEGORIES });
});

router.get("/", optionalAuth, async (req, res) => {
  try {
    const {
      type, q, category, location, from, to, sort, page, limit, mine, status, includeUnverified,
    } = req.query;
    const filter = {};
    if (mine === "true") {
      if (!req.user) return res.status(401).json({ error: "Sign in to continue." });
      filter.user = req.user._id;
      // Hide reports the owner permanently removed from My Reports
      filter.ownerDeleted = { $ne: true };
    } else {
      filter.status = { $ne: "removed" };
    }
    if (type === "lost" || type === "found") filter.type = type;
    if (category && CATEGORIES.includes(category)) filter.category = category;
    if (status && ["open", "claimed", "resolved", "removed"].includes(status)) {
      filter.status = status;
    }
    if (location) filter.location = new RegExp(escapeRegex(location), "i");
    if (q) {
      const re = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ title: re }, { description: re }, { location: re }, { identifyingDetails: re }];
    }
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    let sortBy = { createdAt: -1 };
    if (sort === "oldest") sortBy = { createdAt: 1 };
    if (sort === "title") sortBy = { title: 1 };
    if (sort === "date") sortBy = { date: -1 };
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 9));
    const skip = (pageNum - 1) * pageSize;
    const isMine = mine === "true";
    const staff = isSecurityRole(req.user);
    // Security verification inbox may request all found items (including pending/rejected)
    const allowUnverified =
      String(includeUnverified || "").toLowerCase() === "true" ||
      String(includeUnverified || "") === "1";
    const staffInbox = staff && allowUnverified;

    // Public / normal listings: never show security-pending or rejected found items
    if (!isMine && !staffInbox) {
      filter.$and = (filter.$and || []).concat([
        {
          $or: [
            { type: { $ne: "found" } },
            { "foundCustody.mode": "self" },
            { "foundCustody.verificationStatus": "not_required" },
            { "foundCustody.verificationStatus": "verified" },
            // Legacy found items with no security custody mode
            {
              type: "found",
              $or: [
                { "foundCustody.mode": { $exists: false } },
                { "foundCustody.mode": "" },
                { "foundCustody.mode": null },
              ],
              "foundCustody.verificationStatus": { $nin: ["pending", "rejected"] },
            },
          ],
        },
      ]);
      // Hard exclude security pending/rejected and soft-removed reports
      filter.status = filter.status || { $ne: "removed" };
      filter.$nor = (filter.$nor || []).concat([
        {
          type: "found",
          "foundCustody.mode": "security",
          "foundCustody.verificationStatus": { $in: ["pending", "rejected"] },
        },
        {
          type: "found",
          "foundCustody.mode": "security",
          "foundCustody.verificationStatus": { $ne: "verified" },
        },
      ]);
    }

    const [items, total] = await Promise.all([
      Item.find(filter).populate("user", "name").sort(sortBy).skip(skip).limit(pageSize).lean(),
      Item.countDocuments(filter),
    ]);

    let out = items.map((i) => publicItem(i));
    if (!isMine && !staffInbox) {
      out = out.filter((i) => i.type !== "found" || isFoundPubliclyVisible(i));
    }

    res.json({
      items: out,
      total,
      page: pageNum,
      pages: Math.ceil(total / pageSize) || 1,
    });
  } catch (err) {
    res.status(500).json({ error: "Unable to load items." });
  }
});

router.get("/:id/matches", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.status === "removed") {
      return res.status(404).json({ error: "Item not found." });
    }
    const matches = await findMatches(item, 6);
    res.json({
      matches: matches.map((row) => ({
        ...publicItem(row.item),
        score: row.score,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Unable to find matches." });
  }
});


// Two-way message threads (about items)
router.get("/conversations", protect, async (req, res) => {
  try {
    const list = await Conversation.find({ participants: req.user._id })
      .populate("participants", "name email")
      .populate("item", "title type status")
      .sort({ lastAt: -1 })
      .limit(100)
      .lean();
    res.json({
      conversations: list.map((c) => ({
        ...c,
        id: c._id,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Unable to load conversations." });
  }
});

router.get("/conversations/:threadId", protect, async (req, res) => {
  try {
    const id = req.params.threadId;
    if (!/^[a-fA-F0-9]{24}$/.test(String(id))) {
      return res.status(404).json({ error: "Conversation not found." });
    }
    const convo = await Conversation.findById(id)
      .populate("participants", "name email")
      .populate("item", "title type status");
    if (!convo) return res.status(404).json({ error: "Conversation not found." });
    const isPart = convo.participants.some(
      (p) => String(p._id || p) === String(req.user._id)
    );
    const isSecurity = ["security_head", "sub_security", "admin"].includes(req.user.role);
    if (!isPart && !isSecurity) {
      return res.status(403).json({ error: "You cannot view this conversation." });
    }
    const obj = convo.toObject();
    res.json({ conversation: { ...obj, id: obj._id } });
  } catch (err) {
    res.status(500).json({ error: "Unable to load conversation." });
  }
});

router.post("/conversations/:threadId/messages", protect, async (req, res) => {
  try {
    const id = req.params.threadId;
    if (!/^[a-fA-F0-9]{24}$/.test(String(id))) {
      return res.status(404).json({ error: "Conversation not found." });
    }
    const body = String((req.body && req.body.body) || "").trim();
    if (body.length < 1) {
      return res.status(400).json({ error: "Message cannot be empty." });
    }
    if (body.length > 2000) {
      return res.status(400).json({ error: "Message is too long." });
    }
    const convo = await Conversation.findById(id).populate("participants", "name email");
    if (!convo) return res.status(404).json({ error: "Conversation not found." });
    const isPart = convo.participants.some(
      (p) => String(p._id || p) === String(req.user._id)
    );
    if (!isPart) {
      return res.status(403).json({ error: "You cannot reply in this conversation." });
    }
    convo.messages.push({
      from: req.user._id,
      fromName: req.user.name || "User",
      body,
      createdAt: new Date(),
    });
    convo.lastMessage = body.slice(0, 200);
    convo.lastAt = new Date();
    await convo.save();

    // Notify other participants
    for (const p of convo.participants) {
      const pid = p._id || p;
      if (String(pid) === String(req.user._id)) continue;
      try {
        await Notification.notify(
          pid,
          "contact",
          `${req.user.name || "Someone"} replied about "${convo.itemTitle || "an item"}".`,
          `#/dashboard/found-claims`
        );
      } catch (_e) {}
    }

    const fresh = await Conversation.findById(convo._id)
      .populate("participants", "name email")
      .populate("item", "title type status");
    const obj = fresh.toObject();
    res.status(201).json({ conversation: { ...obj, id: obj._id } });
  } catch (err) {
    console.error("conversation message error:", err);
    res.status(500).json({ error: err.message || "Unable to send message." });
  }
});

// Delete a single message from a conversation ("delete for everyone", like WhatsApp).
// Allowed for the message's original sender, or Security staff (moderation).
router.delete("/conversations/:threadId/messages/:messageId", protect, async (req, res) => {
  try {
    const id = req.params.threadId;
    if (!/^[a-fA-F0-9]{24}$/.test(String(id))) {
      return res.status(404).json({ error: "Conversation not found." });
    }
    const convo = await Conversation.findById(id).populate("participants", "name email");
    if (!convo) return res.status(404).json({ error: "Conversation not found." });
    const isPart = convo.participants.some(
      (p) => String(p._id || p) === String(req.user._id)
    );
    const isSecurity = ["security_head", "sub_security", "admin"].includes(req.user.role);
    if (!isPart && !isSecurity) {
      return res.status(403).json({ error: "You cannot manage this conversation." });
    }

    const msg = convo.messages.id(req.params.messageId);
    if (!msg) return res.status(404).json({ error: "Message not found." });

    const isSender = String(msg.from) === String(req.user._id);
    if (!isSender && !isSecurity) {
      return res.status(403).json({ error: "You can only delete your own messages." });
    }

    msg.deleteOne();

    const last = convo.messages[convo.messages.length - 1];
    convo.lastMessage = last ? last.body.slice(0, 200) : "";
    convo.lastAt = last ? last.createdAt : convo.updatedAt || new Date();
    await convo.save();

    const fresh = await Conversation.findById(convo._id)
      .populate("participants", "name email")
      .populate("item", "title type status");
    const obj = fresh.toObject();
    res.json({ conversation: { ...obj, id: obj._id } });
  } catch (err) {
    console.error("delete conversation message error:", err);
    res.status(500).json({ error: "Unable to delete message." });
  }
});

// Delete an entire conversation thread for everyone in it (like WhatsApp "delete chat").
// Allowed for any participant, or Security staff (moderation).
router.delete("/conversations/:threadId", protect, async (req, res) => {
  try {
    const id = req.params.threadId;
    if (!/^[a-fA-F0-9]{24}$/.test(String(id))) {
      return res.status(404).json({ error: "Conversation not found." });
    }
    const convo = await Conversation.findById(id).populate("participants", "name email");
    if (!convo) return res.status(404).json({ error: "Conversation not found." });
    const isPart = convo.participants.some(
      (p) => String(p._id || p) === String(req.user._id)
    );
    const isSecurity = ["security_head", "sub_security", "admin"].includes(req.user.role);
    if (!isPart && !isSecurity) {
      return res.status(403).json({ error: "You cannot delete this conversation." });
    }

    await Conversation.deleteOne({ _id: convo._id });
    res.json({ ok: true });
  } catch (err) {
    console.error("delete conversation error:", err);
    res.status(500).json({ error: "Unable to delete conversation." });
  }
});



// Early permanent-delete routes (must not 404)
router.post("/purge/:id", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found." });
    const isOwner = sameUserId(item.user, req.user._id);
    const isSecurity = ["security_head", "sub_security", "admin"].includes(req.user.role);
    if (!isOwner && !isSecurity) {
      return res.status(403).json({ error: "You can only delete reports you created." });
    }
    try { await require("../models/Claim").deleteMany({ item: item._id }); } catch (_e) {}
    try { await require("../models/Conversation").deleteMany({ item: item._id }); } catch (_e) {}
    await Item.deleteOne({ _id: item._id });
    res.json({ ok: true, permanent: true });
  } catch (err) {
    res.status(500).json({ error: err.message || "Unable to permanently delete report." });
  }
});


// Owner/security: hide forever from My Reports (no hard DB issues)
router.post("/:id/owner-hide", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found." });
    const isOwner = sameUserId(item.user, req.user._id);
    const isSecurity = ["security_head", "sub_security", "admin"].includes(req.user.role);
    if (!isOwner && !isSecurity) {
      return res.status(403).json({ error: "You can only delete reports you created." });
    }
    // Soft-remove + mark so it disappears from My Reports
    await Item.collection.updateOne(
      { _id: item._id },
      { $set: { status: "removed", ownerDeleted: true } }
    );
    try {
      const Claim = require("../models/Claim");
      await Claim.deleteMany({ item: item._id });
    } catch (_e) {}
    res.json({ ok: true, permanent: true });
  } catch (err) {
    console.error("owner-hide error:", err);
    res.status(500).json({ error: err.message || "Unable to delete report." });
  }
});

// Security: verify or reject a found item submitted into Security custody
router.put("/verify-found/:id", protect, async (req, res) => {
  try {
    const role = (req.userRole || (req.user && req.user.role) || "").toString();
    const okRole =
      role === "security_head" ||
      role === "sub_security" ||
      role === "admin" ||
      (req.user && ["security_head", "sub_security", "admin"].includes(String(req.user.role)));
    if (!okRole) {
      return res.status(403).json({ error: "Security access required." });
    }

    const decision = String((req.body && req.body.decision) || "").trim().toLowerCase();
    if (!["verified", "rejected"].includes(decision)) {
      return res.status(400).json({ error: "Decision must be verified or rejected." });
    }

    const item = await Item.findById(req.params.id);
    if (!item || item.status === "removed") {
      return res.status(404).json({ error: "Item not found." });
    }
    if (item.type !== "found") {
      return res.status(400).json({ error: "Only found items can be verified." });
    }

    const custody = item.foundCustody || {};
    if (String(custody.mode || "") !== "security") {
      return res.status(400).json({ error: "This item was not submitted to Security for verification." });
    }
    if (String(custody.verificationStatus || "") !== "pending") {
      return res.status(400).json({ error: "This item is not pending verification." });
    }

    const note = String((req.body && (req.body.note || req.body.verificationNote)) || "").trim();
    const nextCustody = {
      mode: "security",
      verificationStatus: decision,
      visibility: decision === "verified" ? "public" : "hidden",
      holderDetails: custody.holderDetails || {},
      verifiedBy: req.user._id,
      verifiedByName: req.user.name || "",
      verifiedAt: new Date(),
      verificationNote: note,
    };

    // Rejected: never live + permanently removed from reporter My Reports
    const update = { foundCustody: nextCustody };
    if (decision === "rejected") {
      update.status = "removed";
      update.ownerDeleted = true;
    }

    await Item.collection.updateOne(
      { _id: item._id },
      { $set: update }
    );

    if (decision === "rejected") {
      try {
        await require("../models/Claim").deleteMany({ item: item._id });
      } catch (_e) {}
      try {
        await require("../models/Conversation").deleteMany({ item: item._id });
      } catch (_e) {}
    }

    try {
      await Notification.notify(
        item.user,
        decision === "verified" ? "match" : "system",
        decision === "verified"
          ? `Your found item "${item.title}" was verified by Security and is now live.`
          : `Your found item "${item.title}" was not verified by Security and has been removed from your reports.`,
        decision === "verified" ? `#/item/${item._id}` : `#/dashboard`
      );
    } catch (_n) {}

    const populated = await Item.findById(item._id).populate("user", "name email").lean();
    res.json({ item: publicItem(populated) });
  } catch (err) {
    console.error("verify-found error:", err);
    res.status(500).json({ error: err.message || "Unable to update verification." });
  }
});

router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("user", "name email").lean();
    if (!item) {
      return res.status(404).json({ error: "Item not found." });
    }
    const isOwner = req.user && sameUserId(item.user, req.user._id);
    const isSecurity =
      req.user && ["security_head", "sub_security", "admin"].includes(req.user.role);

    if (item.status === "removed") {
      if (!isOwner && !isSecurity) {
        return res.status(404).json({ error: "Item not found." });
      }
    }

    // Found items submitted to Security stay private until verified
    if (item.type === "found" && !isFoundPubliclyVisible(item) && !isOwner && !isSecurity) {
      return res.status(404).json({ error: "Item not found." });
    }

    // Merge raw mongo fields (actionTaken/handover) in case schema was stale
    const raw = await Item.collection.findOne({ _id: item._id });
    if (raw) {
      if (raw.actionTaken !== undefined) item.actionTaken = raw.actionTaken;
      if (raw.handover !== undefined) item.handover = raw.handover;
      if (raw.foundCustody !== undefined) item.foundCustody = raw.foundCustody;
    }
    res.json({ item: publicItem(item) });
  } catch (err) {
    res.status(500).json({ error: "Unable to load item." });
  }
});

router.post("/", protect, handleUpload, async (req, res) => {
  try {
    const { type, title, category, description, location, date, time, identifyingDetails } = req.body;
    if (!type || !title || !category || !description || !location || !date) {
      return res.status(400).json({ error: "Please complete all required fields." });
    }
    if (type !== "lost" && type !== "found") {
      return res.status(400).json({ error: "Choose Lost or Found." });
    }
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ error: "Choose a valid category." });
    }

    // Found-item custody / verification from report form
    let foundCustody;
    if (type === "found") {
      const mode = String(req.body.foundSubmissionMode || "").trim();
      let holderDetails = {};
      const rawHolder = req.body.foundHolderDetails;
      if (rawHolder) {
        try {
          holderDetails =
            typeof rawHolder === "string" ? JSON.parse(rawHolder) : rawHolder;
        } catch (_e) {
          holderDetails = {};
        }
      }
      const normalizedHolder = {
        name: String(holderDetails.name || "").trim(),
        personType: String(holderDetails.personType || "").trim(),
        idNumber: String(holderDetails.idNumber || "").trim(),
        programme: String(holderDetails.programme || "").trim(),
        department: String(holderDetails.department || "").trim(),
        year: String(holderDetails.year || "").trim(),
        role: String(holderDetails.role || "").trim(),
        workDepartment: String(holderDetails.workDepartment || "").trim(),
        handoverDate: String(holderDetails.handoverDate || "").trim(),
        handoverTime: String(holderDetails.handoverTime || "").trim(),
      };
      if (mode === "security") {
        foundCustody = {
          mode: "security",
          verificationStatus: "pending",
          visibility: "pending",
          holderDetails: normalizedHolder,
        };
      } else if (mode === "self") {
        foundCustody = {
          mode: "self",
          verificationStatus: "not_required",
          visibility: "public",
          holderDetails: normalizedHolder,
        };
      }
    }

    const item = await Item.create({
      type,
      title: title.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      date,
      time: time || "",
      identifyingDetails: identifyingDetails ? identifyingDetails.trim() : "",
      image: req.file ? `/uploads/${req.file.filename}` : "",
      user: req.user._id,
      ...(foundCustody ? { foundCustody } : {}),
    });
    const matches = await findMatches(item, 5);
    for (const row of matches) {
      await Notification.notify(
        row.item.user._id || row.item.user,
        "match",
        `Possible match for your ${row.item.type} report: ${item.title}`,
        `#/item/${item._id}`
      );
    }
    if (matches.length) {
      await Notification.notify(
        req.user._id,
        "match",
        `${matches.length} possible match${matches.length === 1 ? "" : "es"} found for ${item.title}.`,
        `#/item/${item._id}`
      );
    }
    const populated = await Item.findById(item._id).populate("user", "name");
    res.status(201).json({
      item: publicItem(populated),
      matches: matches.map((row) => ({ ...publicItem(row.item), score: row.score })),
    });
  } catch (err) {
    console.error("Create item error:", err);
    res.status(500).json({ error: err.message || "Unable to create report." });
  }
});

router.put("/:id", protect, handleUpload, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.status === "removed") {
      return res.status(404).json({ error: "Item not found." });
    }
    const isOwner = String(item.user) === String(req.user._id);
    const isSecurity = ["security_head", "sub_security", "admin"].includes(req.user.role);
    if (!isOwner && !isSecurity) {
      return res.status(403).json({ error: "You cannot edit this report." });
    }
    const fields = ["title", "category", "description", "location", "date", "time", "identifyingDetails", "status"];
    for (const key of fields) {
      if (req.body[key] !== undefined && req.body[key] !== "") item[key] = req.body[key];
    }
    if (req.file) item.image = `/uploads/${req.file.filename}`;

    // Security custody updates — atomic $set so it always persists
    if (isSecurity && req.body.actionTaken !== undefined && req.body.actionTaken !== null) {
      const action = String(req.body.actionTaken).trim();
      if (!["none", "in_department", "submitted_to_owner"].includes(action)) {
        return res.status(400).json({ error: "Invalid actionTaken value." });
      }

      const notes = String(req.body.notes || req.body.handoverNotes || "").trim();
      let handover = {
        toName: "",
        notes,
        at: null,
        byName: req.user.name || "",
        by: req.user._id,
      };
      let nextStatus = item.status;

      if (action === "none") {
        handover = { toName: "", notes, at: null, byName: "", by: null };
        if (nextStatus === "resolved") nextStatus = "open";
      } else if (action === "in_department") {
        handover.at = new Date();
        if (nextStatus === "resolved") nextStatus = "open";
      } else if (action === "submitted_to_owner") {
        const toName = String(req.body.toName || "").trim();
        if (!toName) {
          return res.status(400).json({
            error: "Enter the name of the person who received the item.",
          });
        }
        handover.toName = toName;
        handover.at = new Date();
        nextStatus = "resolved";
        try {
          await Notification.notify(
            item.user,
            "returned",
            `Your item "${item.title}" was submitted to ${toName}.`,
            `#/item/${item._id}`
          );
        } catch (_n) {}
      }

      // Write via collection so fields persist even if model cache is stale
      await Item.collection.updateOne(
        { _id: item._id },
        {
          $set: {
            actionTaken: action,
            handover,
            status: nextStatus,
            ...(req.file ? { image: `/uploads/${req.file.filename}` } : {}),
          },
        }
      );

      const populated = await Item.findById(item._id).populate("user", "name email").lean();
      return res.json({
        item: publicItem(populated),
        debug: { actionTaken: populated.actionTaken, handover: populated.handover },
      });
    }

    await item.save();
    const populated = await Item.findById(item._id).populate("user", "name").lean();
    res.json({ item: publicItem(populated) });
  } catch (err) {
    res.status(500).json({ error: "Unable to update report." });
  }
});

router.put("/:id/resolve", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found." });
    const isOwner = String(item.user) === String(req.user._id);
    const isSecurity = ["security_head", "sub_security", "admin"].includes(req.user.role);
    if (!isOwner && !isSecurity) {
      return res.status(403).json({ error: "You cannot resolve this report." });
    }
    item.status = "resolved";
    await item.save();
    await Notification.notify(
      item.user,
      "returned",
      `Your report "${item.title}" was marked as resolved.`,
      `#/item/${item._id}`
    );
    res.json({ item: publicItem(await Item.findById(item._id).populate("user", "name")) });
  } catch (err) {
    res.status(500).json({ error: "Unable to resolve item." });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found." });

    const isOwner = sameUserId(item.user, req.user._id);
    const isSecurity = ["security_head", "sub_security", "admin"].includes(req.user.role);

    if (!isOwner && !isSecurity) {
      return res.status(403).json({ error: "You can only delete reports you created." });
    }

    const wantPermanent =
      item.status === "removed" ||
      String(req.query.permanent || "").toLowerCase() === "true" ||
      (req.body && (req.body.permanent === true || String(req.body.permanent || "").toLowerCase() === "true"));

    if (wantPermanent) {
      try {
        const Claim = require("../models/Claim");
        await Claim.deleteMany({ item: item._id });
      } catch (_e) {}
      try {
        const Conversation = require("../models/Conversation");
        await Conversation.deleteMany({ item: item._id });
      } catch (_e) {}
      await Item.deleteOne({ _id: item._id });
      return res.json({ ok: true, permanent: true });
    }

    // Soft delete (hide from public listings)
    item.status = "removed";
    await item.save();

    if (isSecurity && !isOwner) {
      try {
        await Notification.notify(
          item.user,
          "account",
          `Your report "${item.title}" was removed by Security.`,
          "#/dashboard"
        );
      } catch (_e) {}
    }

    res.json({ ok: true, permanent: false });
  } catch (err) {
    console.error("delete item error:", err);
    res.status(500).json({ error: err.message || "Unable to remove report." });
  }
});

// Permanent delete alias (POST) — registered near other :id routes
router.post("/:id/purge", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found." });

    const isOwner = sameUserId(item.user, req.user._id);
    const isSecurity = ["security_head", "sub_security", "admin"].includes(req.user.role);
    if (!isOwner && !isSecurity) {
      return res.status(403).json({ error: "You can only delete reports you created." });
    }

    try {
      const Claim = require("../models/Claim");
      await Claim.deleteMany({ item: item._id });
    } catch (_e) {}
    try {
      const Conversation = require("../models/Conversation");
      await Conversation.deleteMany({ item: item._id });
    } catch (_e) {}

    await Item.deleteOne({ _id: item._id });
    res.json({ ok: true, permanent: true });
  } catch (err) {
    console.error("purge item error:", err);
    res.status(500).json({ error: err.message || "Unable to permanently delete report." });
  }
});


router.post("/:id/contact", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.status === "removed") {
      return res.status(404).json({ error: "Item not found." });
    }
    if (String(item.user) === String(req.user._id)) {
      return res.status(400).json({ error: "You cannot message yourself." });
    }
    const message = (req.body.message || "").trim();
    if (message.length < 10) {
      return res.status(400).json({ error: "Write a message of at least 10 characters." });
    }

    // Find or create a 1:1 conversation about this item between sender and reporter
    const ownerId = item.user;
    const me = req.user._id;
    let convo = await Conversation.findOne({
      item: item._id,
      participants: { $all: [me, ownerId] },
    });
    if (!convo) {
      convo = await Conversation.create({
        item: item._id,
        itemTitle: item.title || "",
        participants: [me, ownerId],
        messages: [],
      });
    }
    convo.messages.push({
      from: me,
      fromName: req.user.name || "User",
      body: message,
      createdAt: new Date(),
    });
    convo.lastMessage = message.slice(0, 200);
    convo.lastAt = new Date();
    convo.itemTitle = item.title || convo.itemTitle;
    await convo.save();

    await Notification.notify(
      ownerId,
      "contact",
      `${req.user.name} sent a message about "${item.title}".`,
      `#/dashboard/found-claims`
    );
    await Notification.notify(
      req.user._id,
      "contact",
      `Your message about "${item.title}" was delivered.`,
      `#/dashboard/found-claims`
    );
    res.status(201).json({ ok: true, conversationId: convo._id });
  } catch (err) {
    console.error("contact error:", err);
    res.status(500).json({ error: err.message || "Unable to send message." });
  }
});


// Security: update custody / action taken on an item
router.put("/:id/custody", protect, async (req, res) => {
  try {
    const role = req.user && req.user.role;
    if (!["security_head", "sub_security", "admin"].includes(role)) {
      return res.status(403).json({ error: "Security access required." });
    }

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found." });
    if (item.status === "removed") {
      return res.status(400).json({ error: "This report was removed." });
    }

    const action = req.body.actionTaken;
    if (!["none", "in_department", "submitted_to_owner"].includes(action)) {
      return res.status(400).json({
        error: "Invalid action. Use none, in_department, or submitted_to_owner.",
      });
    }

    // Ensure fields exist even if older documents lack them
    item.actionTaken = action;

    if (action === "none") {
      item.handover = {
        toName: "",
        notes: (req.body.notes || "").trim(),
        at: undefined,
        byName: "",
        by: undefined,
      };
      if (item.status === "resolved") item.status = "open";
    }

    if (action === "in_department") {
      item.handover = {
        toName: "",
        notes: (req.body.notes || "").trim(),
        at: new Date(),
        byName: req.user.name,
        by: req.user._id,
      };
      // Keep searchable as found-in-custody; status stays open until submitted
      if (item.status === "resolved") item.status = "open";
    }

    if (action === "submitted_to_owner") {
      const toName = (req.body.toName || "").trim();
      if (!toName) {
        return res.status(400).json({
          error: "Enter the name of the person who received the item.",
        });
      }
      item.handover = {
        toName,
        notes: (req.body.notes || "").trim(),
        at: new Date(),
        byName: req.user.name,
        by: req.user._id,
      };
      item.status = "resolved";
      try {
        await Notification.notify(
          item.user,
          "returned",
          `Your item "${item.title}" was submitted to ${toName}.`,
          `#/item/${item._id}`
        );
      } catch (_n) {}
    }

    await item.save();
    const populated = await Item.findById(item._id).populate("user", "name email");
    res.json({ item: publicItem(populated) });
  } catch (err) {
    console.error("Custody update error:", err);
    res.status(500).json({ error: err.message || "Unable to update custody status." });
  }
});

module.exports = router;