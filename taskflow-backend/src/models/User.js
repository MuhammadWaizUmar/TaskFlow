import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, // creates a unique index; duplicate emails are rejected by MongoDB
    lowercase: true, // "Me@Mail.com" and "me@mail.com" are treated as the same user
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false, // never returned by queries unless explicitly requested with .select("+password")
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash the password automatically before every save, but only if it changed.
// (Without the isModified check, editing a user's name would re-hash the
// already-hashed password and lock them out.)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12); // 12 = cost factor (higher = slower = harder to brute-force)
});

// Instance method: compare a plain-text password with the stored hash.
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);