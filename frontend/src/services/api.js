import axios from "axios";

const api = axios.create({
  baseURL: "https://task-manager-qhgi.onrender.com",
});

export const getTasks = () => {
  return api.get("/tasks");
};

export const createTask = (taskData) => {
  return api.post("/tasks", taskData);
};

export const updateTask = (id, taskData) => {
  return api.put(`/tasks/${id}`, taskData);
};

export const deleteTask = (id) => {
  return api.delete(`/tasks/${id}`);
};