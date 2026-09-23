import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";

// Shape of the user object we send to the client (never includes the password)
const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

// POST /api/auth/signup
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error("Email is already registered");
  }

  // The pre("save") hook in the User model hashes the password
  const user = await User.create({ name, email, password });

  res.status(201).json({ token: generateToken(user._id), user: publicUser(user) });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // password has select:false, so we must ask for it explicitly here
  const user = await User.findOne({ email }).select("+password");

  // Same message for "no such user" and "wrong password" so attackers
  // can't use the login form to discover which emails are registered.
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({ token: generateToken(user._id), user: publicUser(user) });
});

// GET /api/auth/me  (protected)
export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});