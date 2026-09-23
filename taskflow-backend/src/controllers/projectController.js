import Project from "../models/Project.js";
import Task from "../models/Task.js";
import asyncHandler from "../utils/asyncHandler.js";

// Every query below filters by BOTH the project id AND owner: req.user._id.
// That is the authorization rule: a user can only ever reach their own projects.
// If the id exists but belongs to someone else, we return 404 (not 403), so the
// API doesn't reveal which ids exist.
const findOwnedProject = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  return project;
};

// GET /api/projects
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ projects });
});

// POST /api/projects
export const createProject = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // Pick only the fields we allow. The owner always comes from the JWT (req.user),
  // never from the request body, so a client can't create projects for someone else.
  const project = await Project.create({ title, description, owner: req.user._id });

  res.status(201).json({ project });
});

// GET /api/projects/:id
export const getProject = asyncHandler(async (req, res) => {
  const project = await findOwnedProject(req, res);
  res.json({ project });
});

// PATCH /api/projects/:id
export const updateProject = asyncHandler(async (req, res) => {
  const project = await findOwnedProject(req, res);

  // Only update the fields that were actually sent, and only allowed ones
  const { title, description } = req.body;
  if (title !== undefined) project.title = title;
  if (description !== undefined) project.description = description;

  await project.save(); // runs schema validation
  res.json({ project });
});

// DELETE /api/projects/:id
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await findOwnedProject(req, res);

  // MongoDB has no foreign-key cascade, so we delete the project's tasks ourselves.
  // Otherwise they would be left behind as orphaned documents.
  await Task.deleteMany({ project: project._id });
  await project.deleteOne();

  res.json({ message: "Project deleted" });
});