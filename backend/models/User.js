const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "sub_security", "security_head", "admin"],
      default: "user",
    },

    userType: {
      type: String,
      enum: ["student", "employee", null],
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

userSchema.pre("save", async function hashPassword() {
  if (this.isModified("status")) {
    this.active = this.status !== "disabled";
  } else if (this.isModified("active")) {
    this.status = this.active ? "active" : "disabled";
  }

  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toPublic = function toPublic() {
  const isActive =
    this.status !== "disabled" && this.active !== false;

  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    userType: this.userType,
    status: isActive ? "active" : "disabled",
    active: isActive,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);