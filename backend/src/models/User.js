const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // <-- 1. Added bcrypt import

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" }, // Since it's a solo project, you are the only user
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt dates
);

// 2. Added the matchPassword function so your controller can use it!
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);