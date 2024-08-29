const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    salt: {
      // To hash the password
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    profileImage: {
      type: String,
      default: "/images/profile-avatar.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

const User = model("user", userSchema);
module.exports = User;
