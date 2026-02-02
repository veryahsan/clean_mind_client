import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import moodApi from "../../services/moodApi";
import { useForm } from "../../hooks/useForm";
import SuccessMessage from "../../components/common/SuccessMessage";
import ErrorMessage from "../../components/common/ErrorMessage";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");

  // Validation rules
  const validationRules = {
    username: {
      required: "Username is required",
    },
    password: {
      required: "Password is required",
    },
  };

  // Extract error message from various error formats
  const extractErrorMessage = (errorData) => {
    if (errorData.message) return errorData.message;
    if (errorData.non_field_errors) {
      return Array.isArray(errorData.non_field_errors)
        ? errorData.non_field_errors[0]
        : errorData.non_field_errors;
    }
    if (errorData.errors?.non_field_errors) {
      return Array.isArray(errorData.errors.non_field_errors)
        ? errorData.errors.non_field_errors[0]
        : errorData.errors.non_field_errors;
    }
    return "";
  };

  // Check if error is verification-related
  const isVerificationError = (message) => {
    if (!message) return false;
    const lowerMessage = message.toLowerCase();
    return (
      lowerMessage.includes("not activated") ||
      lowerMessage.includes("verify your email") ||
      lowerMessage.includes("account is not activated") ||
      lowerMessage.includes("please verify")
    );
  };

  // Extract field errors from error response
  const extractFieldErrors = (errorData) => {
    const fieldErrors = {};

    if (errorData.errors) {
      Object.keys(errorData.errors).forEach((key) => {
        if (key !== "non_field_errors") {
          fieldErrors[key] = Array.isArray(errorData.errors[key])
            ? errorData.errors[key][0]
            : errorData.errors[key];
        }
      });
    }

    // Check top-level field errors
    ["password", "username"].forEach((field) => {
      if (errorData[field] && !fieldErrors[field]) {
        fieldErrors[field] = Array.isArray(errorData[field])
          ? errorData[field][0]
          : errorData[field];
      }
    });

    return fieldErrors;
  };

  // Handle post-login navigation
  const handlePostLoginNavigation = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/dashboard", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(accessToken);
      const isAdmin =
        Boolean(decoded.is_staff) || Boolean(decoded.is_superuser);
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
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Token decode error:", error);
      navigate("/dashboard", { replace: true });
    }
  };

  // Handle verification redirect
  const handleVerificationRedirect = (errorData, username) => {
    const userEmail = errorData.email || errorData.errors?.email || "";
    navigate("/verify-code", {
      state: {
        email: userEmail,
        fromLogin: true,
        username: username,
      },
      replace: true,
    });
  };

  // Form submission handler
  const onSubmit = async (formData) => {
    const { username, password } = formData;

    clearErrors();
    setSuccessMessage("");

    try {
      const result = await login(username, password);

      if (result.success) {
        setSuccessMessage("Login successful!");
        reset();

        // Use requestAnimationFrame for better timing
        requestAnimationFrame(() => {
          handlePostLoginNavigation();
        });
        return;
      }

      if (result.adminVerificationRequired) {
        navigate("/verify-code", {
          state: {
            email: result.email,
            fromLogin: true,
            isAdmin: true,
          },
          replace: true,
        });
        return;
      }

      // Handle error cases
      const errorData = result.error;
      const errorMessage = extractErrorMessage(errorData);

      if (isVerificationError(errorMessage)) {
        handleVerificationRedirect(errorData, username);
        return;
      }

      const fieldErrors = extractFieldErrors(errorData);

      if (Object.keys(fieldErrors).length > 0) {
        setServerErrors(fieldErrors);
      } else {
        setServerErrors({
          general:
            errorMessage ||
            "Login failed. Please check your credentials and try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setServerErrors({
        general: "An unexpected error occurred. Please try again.",
      });
    }
  };

  // Initialize form with useForm hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    canSubmit,
    handleChange,
    handleBlur,
    handleSubmit,
    setServerErrors,
    clearErrors,
    reset,
  } = useForm({ username: "", password: "" }, validationRules, onSubmit);

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

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              disabled={isSubmitting}
              placeholder="Enter your username"
              autoComplete="username"
            />
            {touched.username && errors.username && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1.5">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              disabled={isSubmitting}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {touched.password && errors.password && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1.5">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full flex justify-center items-center gap-2 bg-primary hover:bg-primaryHover text-white py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg ${
              !canSubmit ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={!canSubmit}
          >
            {isSubmitting && (
              <Box sx={{ display: "flex" }}>
                <CircularProgress size={20} color="inherit" />
              </Box>
            )}
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary hover:text-primaryHover font-medium hover:underline transition"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
