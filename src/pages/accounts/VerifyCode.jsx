import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import SuccessMessage from "../../components/common/SuccessMessage";
import ErrorMessage from "../../components/common/ErrorMessage";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const VerifyCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  // Get token and email from location state (passed from registration or login)
  useEffect(() => {
    if (location.state?.verification_token) {
      setVerificationCode(location.state.verification_token);
    }
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    
    // Show message if coming from login
    if (location.state?.fromLogin) {
      setMessage("Please verify your email address to activate your account. Enter the verification code sent to your email.");
      setTimeout(() => setMessage(""), 5000);
    }
  }, [location.state]);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await api.get(`verify-email/${verificationCode.trim()}/`);
      const responseData = response.data;

      // Handle standardized response format
      if (responseData.success) {
        setSuccess(true);
        setMessage(responseData.message || "Email verified successfully!");
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
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

  const handleResend = async () => {
    if (!email) {
      setError("Email address is required to resend verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("resend-verification/", { email });
      const responseData = response.data;

      if (responseData.success) {
        setMessage(responseData.message || "Verification email sent successfully!");
        if (responseData.data?.verification_token) {
          setVerificationCode(responseData.data.verification_token);
        }
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(responseData.message || "Failed to send verification email");
      }
    } catch (err) {
      const errorData = err.response?.data;
      setError(errorData?.message || "Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8 md:p-10">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Verify Your Email
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {email ? `We sent a verification code to ${email}` : "Enter the verification code sent to your email"}
          </p>
        </div>

        <SuccessMessage message={message} onDismiss={() => setMessage("")} />
        <ErrorMessage message={error} />

        {success ? (
          <div className="text-center">
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
            <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition text-center font-mono text-lg"
                placeholder="Enter verification code"
                disabled={loading}
                autoFocus
              />
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 text-center">
                Check your email for the verification code
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !verificationCode.trim()}
              className={`w-full flex justify-center items-center gap-2 bg-primary hover:bg-primaryHover text-white py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg ${
                loading || !verificationCode.trim() ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading && (
                <Box sx={{ display: "flex" }}>
                  <CircularProgress size={20} color="inherit" />
                </Box>
              )}
              {loading ? "Verifying..." : "Verify Email"}
            </button>

            {email && (
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="w-full text-sm text-primary hover:text-primaryHover font-medium hover:underline transition"
              >
                Resend verification code
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default VerifyCode;

