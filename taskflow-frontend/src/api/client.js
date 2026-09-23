import axios from "axios";

// Central axios instance. Every API call in the app should import THIS,
// not axios directly - that's what lets us attach the JWT automatically.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Runs before every request: attach the token from localStorage, if present.
// This is how protected routes (projects, tasks) get authenticated without
// every single api call having to remember to add the header itself.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Runs after every response: if the backend says the token is invalid or
// expired (401), clear it and send the user back to login.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;