import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// Protects a route: requires a valid "Authorization: Bearer <token>" header.
// On success, attaches the logged-in user to req.user for later handlers.
export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized: no token provided");
  }

  const token = header.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET); // throws if invalid, tampered or expired
  } catch {
    res.status(401);
    throw new Error("Not authorized: invalid or expired token");
  }

  // Re-check the user still exists (e.g. account deleted after token was issued)
  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error("Not authorized: user no longer exists");
  }

  req.user = user;
  next();
});