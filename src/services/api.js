import axios from "axios";

const api = axios.create({
  baseURL: "/api/auth/", // Uses Vite proxy to avoid CORS issues
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  const publicEndpoints = ["login/", "register/"];

  const isPublic = publicEndpoints.some((endpoint) =>
    config.url?.includes(endpoint)
  );

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
