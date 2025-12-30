import React, { useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import SuccessMessage from "../../components/common/SuccessMessage";
import ErrorMessage from "../../components/common/ErrorMessage";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!username.trim()) newErrors.username = "Username is required";
    else if (!/^[a-zA-Z0-9@.+\-_]+$/.test(username))
      newErrors.username = "Only letters, numbers, and @ . + - _ are allowed";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    setGeneralError("");
    setSuccessMessage("");
    try {
      const response = await api.post("register/", {
        username,
        email,
        password,
        password2: confirmPassword,
      });

      // Handle standardized response format
      const responseData = response.data;
      if (responseData.success) {
        setSuccessMessage(responseData.message || "Registration successful! Redirecting to login...");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          setSuccessMessage("");
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Handle standardized error format
        if (errorData.success === false) {
          // Set general error message
          if (errorData.message) {
            setGeneralError(errorData.message);
          }
          
          // Set field-specific errors
          if (errorData.errors) {
            setErrors(errorData.errors);
          }
        } else {
          // Handle old format (backward compatibility)
          if (errorData.non_field_errors) {
            const errorMsg = Array.isArray(errorData.non_field_errors) 
              ? errorData.non_field_errors[0] 
              : errorData.non_field_errors;
            setGeneralError(errorMsg);
          } else {
            setErrors(errorData);
            if (errorData.detail) {
              setGeneralError(errorData.detail);
            }
          }
        }
      } else {
        setGeneralError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-md w-full max-w-md p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Start your healthy routine
        </h2>

        <SuccessMessage 
          message={successMessage} 
          onDismiss={() => setSuccessMessage("")} 
        />

        <ErrorMessage message={generalError} />

        <form onSubmit={handleRegister} noValidate className="space-y-4">
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
              placeholder="e.g. ahsanmehmood_"
            />
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Only letters, numbers, and @ . + - _ are allowed
            </p>
            {errors.username && (
              <p className="text-red-600 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              disabled={loading}
              placeholder="example@email.com"
            />
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Enter a valid email address
            </p>
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
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
              placeholder="At least 8 characters"
            />
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Must be at least 8 characters
            </p>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              disabled={loading}
              placeholder="Repeat your password"
            />
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Must match the password above
            </p>
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primaryHover text-white py-2 rounded-md font-medium transition flex justify-center items-center"
          >
            {loading ? (
              <Box sx={{ display: "flex" }}>
                <CircularProgress size={24} color="inherit" />
              </Box>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-300 mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
