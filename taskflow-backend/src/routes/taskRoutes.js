import { Router } from "express";
import { body, param } from "express-validator";
import {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

// mergeParams: true lets this router read :projectId from the parent
// router it gets mounted into (see app.js) - without it, req.params.projectId
// would be undefined here.
const router = Router({ mergeParams: true });

router.use(protect);

const projectIdRule = param("projectId").isMongoId().withMessage("Invalid project id");
const idRule = param("id").isMongoId().withMessage("Invalid task id");

const bodyRules = [
  body("title").optional().trim().notEmpty().withMessage("Task title cannot be empty"),
  body("description").optional().isString().trim(),
  body("status").optional().isIn(["todo", "in-progress", "done"]).withMessage("Invalid status"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
  body("dueDate").optional({ values: "null" }).isISO8601().withMessage("Invalid due date"),
];

const createRules = [
  projectIdRule,
  body("title").trim().notEmpty().withMessage("Task title is required"),
  ...bodyRules.slice(1),
];

const updateRules = [projectIdRule, idRule, ...bodyRules];

router.route("/").get(projectIdRule, validate, getTasks).post(createRules, validate, createTask);

router
  .route("/:id")
  .get(projectIdRule, idRule, validate, getTask)
  .patch(updateRules, validate, updateTask)
  .delete(projectIdRule, idRule, validate, deleteTask);

export default router;