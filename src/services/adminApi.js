import axios from "axios";

// Admin API instance for admin-related endpoints
const adminApi = axios.create({
  baseURL: "/api/admin/", // Uses Vite proxy to avoid CORS issues
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to all requests except verify-login (which doesn't require auth)
adminApi.interceptors.request.use(
  (config) => {
    // Skip auth for verify-login endpoint
    if (config.url && !config.url.includes("verify-login")) {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors (401, 403, etc.)
adminApi.interceptors.response.use(
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

export default adminApi;
