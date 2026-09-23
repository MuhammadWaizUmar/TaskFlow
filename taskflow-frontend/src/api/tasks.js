import api from "./client.js";

// Tasks are nested under a project, matching the backend's route shape:
// /api/projects/:projectId/tasks
export const listTasks = (projectId) =>
  api.get(`/projects/${projectId}/tasks`).then((r) => r.data.tasks);

export const createTask = (projectId, data) =>
  api.post(`/projects/${projectId}/tasks`, data).then((r) => r.data.task);

export const updateTask = (projectId, taskId, data) =>
  api.patch(`/projects/${projectId}/tasks/${taskId}`, data).then((r) => r.data.task);

export const deleteTask = (projectId, taskId) =>
  api.delete(`/projects/${projectId}/tasks/${taskId}`).then((r) => r.data);