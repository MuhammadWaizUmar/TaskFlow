import Project from "../models/Project.js";
import Task from "../models/Task.js";
import asyncHandler from "../utils/asyncHandler.js";

// A Task has no "owner" field of its own (see the schema) - it only has a
// "project" reference. So to check ownership of a task, we first check
// ownership of its parent project, then look the task up within it.
// This one helper is reused by every handler below.
const findOwnedProject = async (req) => {
  const project = await Project.findOne({ _id: req.params.projectId, owner: req.user._id });
  if (!project) {
    const err = new Error("Project not found");
    err.status = 404;
    throw err;
  }
  return project;
};

const findOwnedTask = async (req) => {
  const project = await findOwnedProject(req);
  const task = await Task.findOne({ _id: req.params.id, project: project._id });
  if (!task) {
    const err = new Error("Task not found");
    err.status = 404;
    throw err;
  }
  return task;
};

// GET /api/projects/:projectId/tasks
export const getTasks = asyncHandler(async (req, res) => {
  const project = await findOwnedProject(req);
  const tasks = await Task.find({ project: project._id }).sort({ createdAt: -1 });
  res.json({ tasks });
});

// POST /api/projects/:projectId/tasks
export const createTask = asyncHandler(async (req, res) => {
  const project = await findOwnedProject(req);
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    project: project._id,
  });

  res.status(201).json({ task });
});

// GET /api/projects/:projectId/tasks/:id
export const getTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req);
  res.json({ task });
});

// PATCH /api/projects/:projectId/tasks/:id
// Handles both full edits and drag-and-drop status changes - the frontend
// board just PATCHes { status: "in-progress" } when a card is dropped.
export const updateTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req);

  const { title, description, status, priority, dueDate } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;

  await task.save(); // re-runs the enum validation on status/priority
  res.json({ task });
});

// DELETE /api/projects/:projectId/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req);
  await task.deleteOne();
  res.json({ message: "Task deleted" });
});