const { createHmac, randomBytes } = require("node:crypto");
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    salt: {
      // To hash the password
      type: String,
    },
    password: {
      type: String,
      required: true,
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

// This code runs before a user is saved to the database.
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password) //plain text password that user hit
    .digest("hex"); //hash the plain text password

  this.salt = salt; // save salt to user's database collections
  this.password = hashedPassword; // save hashed password to user's database collections

  next();
});

userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email }); // find user by email
  if (!user) throw new Error("User not found");

  const salt = user.salt;
  const hashedPassword = user.password;

  const userProvidedHash = createHmac("sha256", salt)
    .update(password) // user types plain text
    .digest("hex"); // hash the password

  //compare if the hashed password and user hits passwor is matched
  if (hashedPassword !== userProvidedHash)
    throw new Error("Password does not matched!");

  return user;
});

const User = model("User", userSchema);
module.exports = User;
