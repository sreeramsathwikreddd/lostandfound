const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fromName: { type: String, trim: true, default: "" },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const claimSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    claimant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true, trim: true, maxlength: 1000 },
    proof: { type: String, required: true, trim: true, maxlength: 2000 },
    message: { type: String, trim: true, maxlength: 1000, default: "" },
    // security = item with security/dept; finder = item held by reporting user
    routingTarget: {
      type: String,
      enum: ["security", "finder"],
      default: "finder",
    },
    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected", "completed"],
      default: "pending",
    },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

claimSchema.index({ claimant: 1, createdAt: -1 });
claimSchema.index({ item: 1, claimant: 1 }, { unique: true });
claimSchema.index({ routingTarget: 1, createdAt: -1 });

module.exports = mongoose.model("Claim", claimSchema);
