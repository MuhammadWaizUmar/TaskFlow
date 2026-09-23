import { Router } from "express";
import { body, param } from "express-validator";
import {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import taskRoutes from "./taskRoutes.js";

const router = Router();

// Every project route requires a logged-in user
router.use(protect);

const idRule = param("id").isMongoId().withMessage("Invalid project id");

const createRules = [
  body("title").trim().notEmpty().withMessage("Project title is required"),
  body("description").optional().isString().withMessage("Description must be text").trim(),
];

const updateRules = [
  idRule,
  body("title").optional().trim().notEmpty().withMessage("Project title cannot be empty"),
  body("description").optional().isString().withMessage("Description must be text").trim(),
];

router.route("/").get(getProjects).post(createRules, validate, createProject);

router
  .route("/:id")
  .get(idRule, validate, getProject)
  .patch(updateRules, validate, updateProject)
  .delete(idRule, validate, deleteProject);

// Nested: /api/projects/:projectId/tasks/...
router.use("/:projectId/tasks", taskRoutes);

export default router;