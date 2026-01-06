import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import SuccessMessage from "../../components/common/SuccessMessage";
import ErrorMessage from "../../components/common/ErrorMessage";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError("Invalid verification link. No token provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`verify-email/${token}/`);
        const responseData = response.data;

        // Handle standardized response format
        if (responseData.success) {
          setSuccess(true);
          setMessage(responseData.message || "Email verified successfully!");

          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 3000);
        } else {
          setError(responseData.message || "Verification failed");
        }
      } catch (err) {
        const errorData = err.response?.data;

        // Handle standardized error format
        if (errorData && errorData.success === false) {
          setError(errorData.message || "Verification failed");
        } else if (errorData?.message) {
          setError(errorData.message);
        } else {
          setError("An error occurred during verification. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const handleResend = () => {
    navigate("/login", { state: { showResend: true } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <CircularProgress size={40} />
          </Box>
          <p className="text-gray-600 dark:text-gray-400">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8 md:p-10 text-center">
        {success ? (
          <>
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Email Verified!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {message}
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Redirecting to login page...
            </p>
            <Link
              to="/login"
              className="inline-block bg-primary hover:bg-primaryHover text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Go to Login
            </Link>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Verification Failed
              </h2>
              <ErrorMessage message={error} />
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The verification link may have expired or is invalid. You can request a new verification email.
              </p>
              <button
                onClick={handleResend}
                className="w-full bg-primary hover:bg-primaryHover text-white py-3 rounded-lg font-medium transition"
              >
                Request New Verification Email
              </button>
              <Link
                to="/login"
                className="block text-center text-primary hover:text-primaryHover font-medium text-sm"
              >
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

