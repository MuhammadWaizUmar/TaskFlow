import { Router } from "express";
import { body } from "express-validator";
import { signup, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = Router();

const signupRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .isLength({ max: 72 }) // bcrypt ignores anything past 72 bytes
    .withMessage("Password must be at most 72 characters"),
];

const loginRules = [
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/signup", signupRules, validate, signup);
router.post("/login", loginRules, validate, login);
router.get("/me", protect, getMe);

export default router;