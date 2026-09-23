import jwt from "jsonwebtoken";

// The token payload only holds the user id. Never put passwords or
// other sensitive data in a JWT: it is signed, not encrypted.
export default function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}