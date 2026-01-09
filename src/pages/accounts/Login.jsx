import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import moodApi from "../../services/moodApi";
import SuccessMessage from "../../components/common/SuccessMessage";
import ErrorMessage from "../../components/common/ErrorMessage";
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
      
      setTimeout(async () => {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/dashboard", { replace: true });
          return;
        }

        try {
          const decoded = jwtDecode(accessToken);
          const isAdmin = Boolean(decoded.is_staff) || Boolean(decoded.is_superuser);
          const userRole = decoded.role || null;
          
          if (isAdmin) {
            navigate("/admin", { replace: true });
            return;
          }
          
          if (userRole === "member") {
            try {
              await moodApi.get("today/");
            } catch {
              // Continue to dashboard even if mood check fails
            }
            navigate("/dashboard", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        } catch {
          navigate("/dashboard", { replace: true });
        }
      }, 50);
    } else if (result.adminVerificationRequired) {
      navigate("/verify-code", {
        state: {
          email: result.email,
          fromLogin: true,
          isAdmin: true,
        },
        replace: true,
      });
    } else {
      const errorData = result.error;
      const errorMessage = errorData.message || 
        (errorData.non_field_errors && (Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors)) ||
        "";
      
      const isVerificationError = errorMessage && (
        errorMessage.toLowerCase().includes("not activated") || 
        errorMessage.toLowerCase().includes("verify your email") ||
        errorMessage.toLowerCase().includes("account is not activated") ||
        errorMessage.toLowerCase().includes("please verify")
      );
      
      if (isVerificationError) {
        const userEmail = errorData.email || errorData.errors?.email || "";
        navigate("/verify-code", {
          state: {
            email: userEmail,
            fromLogin: true,
            username: username,
          },
          replace: true,
        });
        return;
      }
      
      const fieldErrors = {};
      if (errorData.errors) {
        Object.keys(errorData.errors).forEach((key) => {
          fieldErrors[key] = Array.isArray(errorData.errors[key])
            ? errorData.errors[key][0]
            : errorData.errors[key];
        });
      }
      
      if (errorData.password && !fieldErrors.password) {
        fieldErrors.password = Array.isArray(errorData.password) 
          ? errorData.password[0] 
          : errorData.password;
      }
      if (errorData.username && !fieldErrors.username) {
        fieldErrors.username = Array.isArray(errorData.username) 
          ? errorData.username[0] 
          : errorData.username;
      }
      
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        let errorMsg = "";
        if (errorData.non_field_errors) {
          errorMsg = Array.isArray(errorData.non_field_errors) 
            ? errorData.non_field_errors[0] 
            : errorData.non_field_errors;
        } else if (errorData.errors?.non_field_errors) {
          errorMsg = Array.isArray(errorData.errors.non_field_errors)
            ? errorData.errors.non_field_errors[0]
            : errorData.errors.non_field_errors;
        } else if (errorData.message) {
          errorMsg = errorData.message;
        }
        
        setErrors({ general: errorMsg || "Login failed. Please check your credentials and try again." });
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8 md:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Sign in to your account
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          Welcome back! Please enter your credentials.
        </p>

        <SuccessMessage 
          message={successMessage} 
          onDismiss={() => setSuccessMessage("")} 
        />

        <ErrorMessage message={errors.general} />

        <form onSubmit={handleLogin} noValidate className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              disabled={loading}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1.5">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              disabled={loading}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1.5">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full flex justify-center items-center gap-2 bg-primary hover:bg-primaryHover text-white py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading && (
              <Box sx={{ display: "flex" }}>
                <CircularProgress size={20} color="inherit" />
              </Box>
            )}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:text-primaryHover font-medium hover:underline transition">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
