const express = require("express");
const Claim = require("../models/Claim");
const Item = require("../models/Item");
const Notification = require("../models/Notification");
const { protect, securityOnly } = require("../middleware/auth");

const router = express.Router();
const STATUSES = ["pending", "under_review", "approved", "rejected", "completed"];

function serialize(claim) {
  const obj =
    claim && typeof claim.toObject === "function"
      ? claim.toObject({ virtuals: false })
      : { ...(claim || {}) };
  if (obj.messages && Array.isArray(obj.messages)) {
    obj.messages = obj.messages.map((m) => ({
      ...m,
      from: m.from && m.from._id ? m.from._id : m.from,
    }));
  }
  return { ...obj, id: obj._id || obj.id };
}

function isSecurityRole(user) {
  return user && ["security_head", "sub_security", "admin"].includes(user.role);
}

// Claims I submitted (claimant) — "My Claim Submission"
router.get("/mine", protect, async (req, res) => {
  try {
    const claims = await Claim.find({ claimant: req.user._id })
      .populate({ path: "item", populate: { path: "user", select: "name" } })
      .populate("claimant", "name email")
      .sort({ createdAt: -1 });
    res.json({ claims: claims.map(serialize) });
  } catch (err) {
    res.status(500).json({ error: "Unable to load claims." });
  }
});

// Claims on MY found items that were routed to ME (self-custody only)
router.get("/on-my-found", protect, async (req, res) => {
  try {
    const myItems = await Item.find({
      user: req.user._id,
      type: "found",
      status: { $ne: "removed" },
    }).select("_id");
    const ids = myItems.map((i) => i._id);
    const claims = await Claim.find({
      item: { $in: ids },
      routingTarget: "finder",
    })
      .populate("claimant", "name email")
      .populate("item")
      .sort({ createdAt: -1 });
    res.json({ claims: claims.map(serialize) });
  } catch (err) {
    res.status(500).json({ error: "Unable to load claims on your found items." });
  }
});

// Security desk: only claims routed to security (item held by department)
router.get("/", protect, securityOnly, async (req, res) => {
  try {
    const claims = await Claim.find({ routingTarget: "security" })
      .populate("claimant", "name email")
      .populate("item")
      .sort({ createdAt: -1 });
    // Extra guard: never leak finder-routed (user↔user) claims to security desk
    const onlySecurity = claims.filter((c) => String(c.routingTarget) === "security");
    res.json({ claims: onlySecurity.map(serialize) });
  } catch (err) {
    res.status(500).json({ error: "Unable to load claims." });
  }
});

router.get("/item/:itemId", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ error: "Item not found." });
    const isOwner = String(item.user) === String(req.user._id);
    const isSecurity = isSecurityRole(req.user);
    if (!isOwner && !isSecurity) {
      return res.status(403).json({ error: "You cannot view these claims." });
    }
    const filter = { item: item._id };
    // Owner of self-custody item only sees finder-routed claims
    if (isOwner && !isSecurity) {
      filter.routingTarget = "finder";
    }
    if (isSecurity && !isOwner) {
      filter.routingTarget = "security";
    }
    const claims = await Claim.find(filter)
      .populate("claimant", "name")
      .sort({ createdAt: -1 });
    res.json({ claims: claims.map(serialize) });
  } catch (err) {
    res.status(500).json({ error: "Unable to load claims." });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { itemId, reason, proof, message } = req.body;
    if (!itemId || !reason || !proof) {
      return res.status(400).json({ error: "Item, reason, and proof are required." });
    }
    const item = await Item.findById(itemId);
    if (!item || item.status === "removed") {
      return res.status(404).json({ error: "Item not found." });
    }
    if (item.status === "resolved") {
      return res.status(400).json({ error: "This item is already resolved." });
    }
    if (String(item.user) === String(req.user._id)) {
      return res.status(400).json({ error: "You cannot claim your own report." });
    }
    const existing = await Claim.findOne({ item: item._id, claimant: req.user._id });
    if (existing) {
      return res.status(400).json({ error: "You already submitted a claim for this item." });
    }

    const custody = item.foundCustody || {};
    const mode = String(custody.mode || "").toLowerCase();
    // Self-hold / empty → finder only. Department hold → security only.
    const routingTarget = mode === "security" ? "security" : "finder";

    const claim = await Claim.create({
      item: item._id,
      claimant: req.user._id,
      reason: reason.trim(),
      proof: proof.trim(),
      message: message ? message.trim() : "",
      routingTarget,
      messages: message
        ? [
            {
              from: req.user._id,
              fromName: req.user.name || "Claimant",
              body: String(message).trim(),
              createdAt: new Date(),
            },
          ]
        : [],
    });

    if (routingTarget === "security") {
      // ONLY security staff — never the reporting user
      const User = require("../models/User");
      const staff = await User.find({
        role: { $in: ["security_head", "sub_security", "admin"] },
        status: { $ne: "disabled" },
      }).select("_id");
      for (const s of staff) {
        try {
          await Notification.notify(
            s._id,
            "claim",
            `${req.user.name} submitted a claim for "${item.title}" (held by Security).`,
            `#/security-head/submitted-claims`
          );
        } catch (_e) {}
      }
    } else {
      // ONLY the user who is holding the item (reporter) — never security
      await Notification.notify(
        item.user,
        "claim",
        `${req.user.name} submitted a claim for your found item "${item.title}".`,
        `#/dashboard/found-claims`
      );
    }

    // Claimant confirmation
    await Notification.notify(
      req.user._id,
      "claim",
      `Your claim for "${item.title}" was submitted.`,
      `#/dashboard/found-claims`
    );

    const populated = await Claim.findById(claim._id)
      .populate("claimant", "name email")
      .populate("item");
    res.status(201).json({ claim: serialize(populated) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "You already submitted a claim for this item." });
    }
    console.error("claim create error:", err);
    res.status(500).json({ error: err.message || "Unable to submit claim." });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    if (!/^[a-fA-F0-9]{24}$/.test(String(req.params.id))) {
      return res.status(404).json({ error: "Claim not found." });
    }
    const claim = await Claim.findById(req.params.id).populate("item");
    if (!claim) return res.status(404).json({ error: "Claim not found." });
    const item = claim.item;
    const isOwner = item && String(item.user) === String(req.user._id);
    const isSecurity = isSecurityRole(req.user);
    // Only the correct desk can review
    if (claim.routingTarget === "security" && !isSecurity) {
      return res.status(403).json({ error: "Only Security can review this claim." });
    }
    if (claim.routingTarget === "finder" && !isOwner && !isSecurity) {
      return res.status(403).json({ error: "You cannot review this claim." });
    }
    const { status } = req.body;
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid claim status." });
    }
    claim.status = status;
    await claim.save();

    if (status === "approved") {
      await Notification.notify(
        claim.claimant,
        "claim",
        `Your claim for "${item.title}" was approved.`,
        `#/item/${item._id}`
      );
    } else if (status === "rejected") {
      await Notification.notify(
        claim.claimant,
        "claim",
        `Your claim for "${item.title}" was rejected.`,
        `#/item/${item._id}`
      );
    } else if (status === "completed") {
      item.status = "resolved";
      await item.save();
      await Notification.notify(
        claim.claimant,
        "returned",
        `The item "${item.title}" was marked as returned.`,
        `#/item/${item._id}`
      );
    } else if (status === "under_review") {
      await Notification.notify(
        claim.claimant,
        "claim",
        `Your claim for "${item.title}" is under review.`,
        `#/dashboard/found-claims`
      );
    }
    const populated = await Claim.findById(claim._id)
      .populate("claimant", "name email")
      .populate("item");
    res.json({ claim: serialize(populated) });
  } catch (err) {
    res.status(500).json({ error: "Unable to update claim." });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    if (!/^[a-fA-F0-9]{24}$/.test(String(req.params.id))) {
      return res.status(404).json({ error: "Claim not found." });
    }
    const claim = await Claim.findById(req.params.id)
      .populate("claimant", "name email")
      .populate({ path: "item", populate: { path: "user", select: "name email" } });
    if (!claim) return res.status(404).json({ error: "Claim not found." });

    const item = claim.item;
    const isClaimant = String(claim.claimant._id || claim.claimant) === String(req.user._id);
    const isOwner = item && String(item.user._id || item.user) === String(req.user._id);
    const isSecurity = isSecurityRole(req.user);

    if (claim.routingTarget === "security") {
      if (!isClaimant && !isSecurity) {
        return res.status(403).json({ error: "You cannot view this claim." });
      }
    } else {
      if (!isClaimant && !isOwner) {
        return res.status(403).json({ error: "You cannot view this claim." });
      }
    }
    res.json({ claim: serialize(claim) });
  } catch (err) {
    res.status(500).json({ error: "Unable to load claim." });
  }
});

router.post("/:id/messages", protect, async (req, res) => {
  try {
    const body = String((req.body && req.body.body) || "").trim();
    if (body.length < 1) {
      return res.status(400).json({ error: "Message cannot be empty." });
    }
    if (body.length > 2000) {
      return res.status(400).json({ error: "Message is too long." });
    }
    if (!/^[a-fA-F0-9]{24}$/.test(String(req.params.id))) {
      return res.status(404).json({ error: "Claim not found." });
    }

    const claim = await Claim.findById(req.params.id)
      .populate("claimant", "name email")
      .populate({ path: "item", populate: { path: "user", select: "name email" } });
    if (!claim) return res.status(404).json({ error: "Claim not found." });

    const item = claim.item;
    const claimantId = claim.claimant._id || claim.claimant;
    const ownerId = item && (item.user._id || item.user);
    const isClaimant = String(claimantId) === String(req.user._id);
    const isOwner = ownerId && String(ownerId) === String(req.user._id);
    const isSecurity = isSecurityRole(req.user);

    if (claim.routingTarget === "security") {
      if (!isClaimant && !isSecurity) {
        return res.status(403).json({ error: "You cannot message on this claim." });
      }
    } else {
      if (!isClaimant && !isOwner) {
        return res.status(403).json({ error: "You cannot message on this claim." });
      }
    }

    claim.messages.push({
      from: req.user._id,
      fromName: req.user.name || "User",
      body,
      createdAt: new Date(),
    });
    await claim.save();

    try {
      const recipients = new Set();
      if (!isClaimant) recipients.add(String(claimantId));
      if (claim.routingTarget === "security") {
        if (!isSecurity) {
          const User = require("../models/User");
          const staff = await User.find({
            role: { $in: ["security_head", "sub_security", "admin"] },
            status: { $ne: "disabled" },
          }).select("_id");
          staff.forEach((s) => recipients.add(String(s._id)));
        }
      } else if (ownerId && !isOwner) {
        recipients.add(String(ownerId));
      }
      recipients.delete(String(req.user._id));
      const title = (item && item.title) || "item";
      for (const rid of recipients) {
        await Notification.notify(
          rid,
          "claim",
          `${req.user.name || "Someone"} sent a message on a claim for "${title}".`,
          claim.routingTarget === "security"
            ? `#/security-head/submitted-claims`
            : `#/dashboard/found-claims`
        );
      }
    } catch (_n) {}

    const fresh = await Claim.findById(claim._id)
      .populate("claimant", "name email")
      .populate({ path: "item", populate: { path: "user", select: "name email" } });
    res.status(201).json({ claim: serialize(fresh) });
  } catch (err) {
    console.error("claim message error:", err);
    res.status(500).json({ error: err.message || "Unable to send message." });
  }
});


// Delete a single message from a claim's chat ("delete for everyone", like WhatsApp).
// Allowed for the message's original sender, or Security staff (moderation).
router.delete("/:id/messages/:messageId", protect, async (req, res) => {
  try {
    if (!/^[a-fA-F0-9]{24}$/.test(String(req.params.id))) {
      return res.status(404).json({ error: "Claim not found." });
    }

    const claim = await Claim.findById(req.params.id)
      .populate("claimant", "name email")
      .populate({ path: "item", populate: { path: "user", select: "name email" } });
    if (!claim) return res.status(404).json({ error: "Claim not found." });

    const item = claim.item;
    const claimantId = claim.claimant._id || claim.claimant;
    const ownerId = item && (item.user._id || item.user);
    const isClaimant = String(claimantId) === String(req.user._id);
    const isOwner = ownerId && String(ownerId) === String(req.user._id);
    const isSecurity = isSecurityRole(req.user);

    if (claim.routingTarget === "security") {
      if (!isClaimant && !isSecurity) {
        return res.status(403).json({ error: "You cannot manage this claim's chat." });
      }
    } else {
      if (!isClaimant && !isOwner) {
        return res.status(403).json({ error: "You cannot manage this claim's chat." });
      }
    }

    const msg = claim.messages.id(req.params.messageId);
    if (!msg) return res.status(404).json({ error: "Message not found." });

    const isSender = String(msg.from) === String(req.user._id);
    if (!isSender && !isSecurity) {
      return res.status(403).json({ error: "You can only delete your own messages." });
    }

    msg.deleteOne();
    await claim.save();

    const fresh = await Claim.findById(claim._id)
      .populate("claimant", "name email")
      .populate({ path: "item", populate: { path: "user", select: "name email" } });
    res.json({ claim: serialize(fresh) });
  } catch (err) {
    console.error("delete claim message error:", err);
    res.status(500).json({ error: "Unable to delete message." });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {
    if (!/^[a-fA-F0-9]{24}$/.test(String(req.params.id))) {
      return res.status(404).json({ error: "Claim not found." });
    }
    const claim = await Claim.findById(req.params.id).populate("item");
    if (!claim) return res.status(404).json({ error: "Claim not found." });

    const item = claim.item;
    const isClaimant = String(claim.claimant) === String(req.user._id);
    const isOwner = item && String(item.user) === String(req.user._id);
    const isSecurity = ["security_head", "sub_security", "admin"].includes(req.user.role);

    let allowed = false;
    if (isClaimant) allowed = true;
    else if (claim.routingTarget === "security" && isSecurity) allowed = true;
    else if (claim.routingTarget === "finder" && isOwner) allowed = true;

    if (!allowed) {
      return res.status(403).json({ error: "You cannot delete this claim." });
    }

    await Claim.deleteOne({ _id: claim._id });
    res.json({ ok: true });
  } catch (err) {
    console.error("delete claim error:", err);
    res.status(500).json({ error: "Unable to delete claim." });
  }
});

module.exports = router;