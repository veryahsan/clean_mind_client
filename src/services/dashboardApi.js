import axios from "axios";

// Dashboard API instance for dashboard-related endpoints
const dashboardApi = axios.create({
  baseURL: "/api/dashboard/", // Uses Vite proxy to avoid CORS issues
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to all requests
dashboardApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors (401, 403, etc.)
dashboardApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        // Clear invalid token
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        // Redirect to login (will be handled by ProtectedRoute)
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default dashboardApi;
