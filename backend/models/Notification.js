const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true, maxlength: 400 },
  link: { type: String, default: "" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

notificationSchema.statics.notify = function notify(user, type, message, link) {
  return this.create({ user, type, message, link: link || "" });
};

module.exports = mongoose.model("Notification", notificationSchema);
