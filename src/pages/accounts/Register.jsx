import React, { useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import SuccessMessage from "../../components/common/SuccessMessage";
import ErrorMessage from "../../components/common/ErrorMessage";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Register = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  // Validation rules
  const validationRules = {
    username: {
      required: "Username is required",
      pattern: {
        value: /^[a-zA-Z0-9@.+\-_]+$/,
        message: "Only letters, numbers, and @ . + - _ are allowed",
      },
    },
    email: {
      required: "Email is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email address",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
      },
    },
    confirmPassword: {
      required: "Please confirm your password",
      custom: (value, allValues) => {
        if (value !== allValues.password) {
          return "Passwords do not match";
        }
        return "";
      },
    },
  };

  // Extract error message from response
  const extractErrorMessage = (errorData) => {
    if (errorData.message) return errorData.message;
    if (errorData.non_field_errors) {
      return Array.isArray(errorData.non_field_errors)
        ? errorData.non_field_errors[0]
        : errorData.non_field_errors;
    }
    if (errorData.detail) return errorData.detail;
    return "";
  };

  // Extract field errors from response
  const extractFieldErrors = (errorData) => {
    const fieldErrors = {};

    // Handle standardized error format
    if (errorData.errors) {
      Object.keys(errorData.errors).forEach((key) => {
        fieldErrors[key] = Array.isArray(errorData.errors[key])
          ? errorData.errors[key][0]
          : errorData.errors[key];
      });
      return fieldErrors;
    }

    // Handle old format (backward compatibility)
    Object.keys(errorData).forEach((key) => {
      if (
        key !== "non_field_errors" &&
        key !== "detail" &&
        key !== "message" &&
        key !== "success"
      ) {
        fieldErrors[key] = Array.isArray(errorData[key])
          ? errorData[key][0]
          : errorData[key];
      }
    });

    return fieldErrors;
  };

  // Form submission handler
  const onSubmit = async (formData) => {
    const { username, email, password, confirmPassword } = formData;

    clearErrors();
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
        const userEmail = responseData.data?.email || email;

        // Redirect to verification page
        navigate("/verify-code", {
          state: {
            email: userEmail,
            fromRegistration: true,
          },
        });
      }
    } catch (err) {
      if (err.response?.data) {
        const errorData = err.response.data;

        // Extract general error message
        const generalError = extractErrorMessage(errorData);

        // Extract field-specific errors
        const fieldErrors = extractFieldErrors(errorData);

        // Set errors in form
        if (Object.keys(fieldErrors).length > 0) {
          setServerErrors(fieldErrors);
        }

        if (generalError) {
          setServerErrors({ general: generalError });
        }

        // If no specific errors found, set generic message
        if (Object.keys(fieldErrors).length === 0 && !generalError) {
          setServerErrors({
            general: "Registration failed. Please try again.",
          });
        }
      } else {
        setServerErrors({
          general: "Registration failed. Please try again.",
        });
      }
    }
  };

  // Initialize form with useForm hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setServerErrors,
    clearErrors,
  } = useForm(
    {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationRules,
    onSubmit
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8 md:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Start your healthy routine
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          Create your account to get started
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
              placeholder="e.g. ahsanmehmood_"
              autoComplete="username"
            />
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5">
              Only letters, numbers, and @ . + - _ are allowed
            </p>
            {touched.username && errors.username && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1.5">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              disabled={isSubmitting}
              placeholder="example@email.com"
              autoComplete="email"
            />
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5">
              Enter a valid email address
            </p>
            {touched.email && errors.email && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1.5">
                {errors.email}
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
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5">
              Must be at least 8 characters
            </p>
            {touched.password && errors.password && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1.5">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              disabled={isSubmitting}
              placeholder="Repeat your password"
              autoComplete="new-password"
            />
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5">
              Must match the password above
            </p>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1.5">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-primary hover:bg-primaryHover text-white py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg flex justify-center items-center ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                <span>Creating account...</span>
              </Box>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:text-primaryHover font-medium hover:underline transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
