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

const conversationSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    itemTitle: { type: String, trim: true, default: "" },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    messages: { type: [messageSchema], default: [] },
    lastMessage: { type: String, default: "" },
    lastAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1, lastAt: -1 });
conversationSchema.index({ item: 1, participants: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);
