import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    const result = await login(username, password);

    if (result.success) {
      setSuccessMessage("Login successful!");
      setUsername("");
      setPassword("");

      setTimeout(() => {
        navigate("/member-dashboard");
      }, 800);
    } else {
      // Handle errors from the context
      const errorData = result.error;
      if (errorData.non_field_errors) {
        setErrors({ ...errors, general: errorData.non_field_errors[0] || errorData.non_field_errors });
      } else if (errorData.username) {
        setErrors({ username: Array.isArray(errorData.username) ? errorData.username[0] : errorData.username });
      } else if (errorData.password) {
        setErrors({ password: Array.isArray(errorData.password) ? errorData.password[0] : errorData.password });
      } else {
        setErrors({ general: "Login failed. Please try again." });
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-md w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Sign in to your account
        </h2>

        {successMessage && (
          <div className="bg-green-500 text-white rounded-md px-4 py-2 mb-4">
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div className="bg-red-500 text-white rounded-md px-4 py-2 mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleLogin} noValidate className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
            {errors.username && (
              <p className="text-red-600 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full flex justify-center items-center gap-2 bg-primary hover:bg-primaryHover text-white py-2 rounded-md font-medium transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading && (
              <Box sx={{ display: "flex" }}>
                <CircularProgress size={20} color="inherit" />
              </Box>
            )}
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-300 mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
