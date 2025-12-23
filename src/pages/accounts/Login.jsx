import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

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

    try {
      await api.post("login/", { username, password });
      setSuccessMessage("Login successful!");
      setUsername("");
      setPassword("");
      setErrors({});
    } catch (err) {
      if (err.response?.data) setErrors(err.response.data);
      else alert("Login failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-md w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
          Login
        </h2>

        {successMessage && (
          <div className="bg-green-500 text-white rounded-md px-4 py-2 mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleLogin} noValidate className="space-y-4">
          {/* Username */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            />
            {errors.username && (
              <p className="text-red-600 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primaryHover text-white py-2 rounded-md font-medium transition"
          >
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
