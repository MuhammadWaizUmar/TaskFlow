import api from "./client.js";

// Thin wrappers around the projects endpoints. Pages call these instead of
// calling `api.get(...)` directly, so the URL shape only lives in one place.
export const listProjects = () => api.get("/projects").then((r) => r.data.projects);

export const createProject = (data) => api.post("/projects", data).then((r) => r.data.project);

export const updateProject = (id, data) =>
  api.patch(`/projects/${id}`, data).then((r) => r.data.project);

export const deleteProject = (id) => api.delete(`/projects/${id}`).then((r) => r.data);