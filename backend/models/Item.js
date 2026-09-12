const mongoose = require("mongoose");

const CATEGORIES = [
  "Electronics",
  "Documents",
  "Bags",
  "Clothing",
  "Jewelry",
  "Keys",
  "Pets",
  "Other",
];

const ownerDetailsSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 120, default: "" },
    personType: { type: String, enum: ["student", "employee", ""], default: "" },
    idNumber: { type: String, trim: true, maxlength: 80, default: "" },
    programme: { type: String, trim: true, maxlength: 120, default: "" },
    department: { type: String, trim: true, maxlength: 160, default: "" },
    year: { type: String, trim: true, maxlength: 60, default: "" },
    role: { type: String, trim: true, maxlength: 120, default: "" },
    workDepartment: { type: String, trim: true, maxlength: 160, default: "" },
    handoverDate: { type: String, trim: true, default: "" },
    handoverTime: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const handoverSchema = new mongoose.Schema(
  {
    toName: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, maxlength: 1000, default: "" },
    at: { type: Date },
    byName: { type: String, trim: true, default: "" },
    by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

const foundHolderDetailsSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 120, default: "" },
    personType: { type: String, enum: ["student", "employee", "security", ""], default: "" },
    idNumber: { type: String, trim: true, maxlength: 80, default: "" },
    programme: { type: String, trim: true, maxlength: 120, default: "" },
    department: { type: String, trim: true, maxlength: 160, default: "" },
    year: { type: String, trim: true, maxlength: 60, default: "" },
    role: { type: String, trim: true, maxlength: 120, default: "" },
    workDepartment: { type: String, trim: true, maxlength: 160, default: "" },
    handoverDate: { type: String, trim: true, default: "" },
    handoverTime: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const foundCustodySchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: ["self", "security", ""],
      default: "",
    },
    verificationStatus: {
      type: String,
      enum: ["not_required", "pending", "verified", "rejected", ""],
      default: "",
    },
    visibility: {
      type: String,
      enum: ["public", "pending", "hidden", ""],
      default: "",
    },
    holderDetails: {
      type: foundHolderDetailsSchema,
      default: () => ({}),
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedByName: { type: String, trim: true, default: "" },
    verifiedAt: { type: Date },
    verificationNote: { type: String, trim: true, maxlength: 500, default: "" },
  },
  { _id: false }
);

const itemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["lost", "found"], required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, enum: CATEGORIES, required: true },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    location: { type: String, required: true, trim: true, maxlength: 160 },
    date: { type: Date, required: true },
    time: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
    identifyingDetails: { type: String, trim: true, maxlength: 1000, default: "" },
    status: {
      type: String,
      enum: ["open", "claimed", "resolved", "removed"],
      default: "open",
    },
    actionTaken: {
      type: String,
      enum: ["none", "in_department", "submitted_to_owner"],
      default: "none",
    },
    handover: {
      type: handoverSchema,
      default: () => ({}),
    },
    ownerDetails: {
      type: ownerDetailsSchema,
      default: () => ({}),
    },
    foundCustody: {
      type: foundCustodySchema,
      default: () => ({}),
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

itemSchema.index({ type: 1, status: 1, createdAt: -1 });
itemSchema.index({ title: "text", description: "text", location: "text" });
itemSchema.index({ type: 1, "foundCustody.verificationStatus": 1, createdAt: -1 });

module.exports = mongoose.model("Item", itemSchema);
module.exports.CATEGORIES = CATEGORIES;
