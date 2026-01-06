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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  // Get email and context from location state (passed from registration or login)
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    
    // Contextual info message
    if (location.state?.fromLogin) {
      setMessage("Your email is not verified. We have sent you a verification link. Please check your email and click the link to activate your account.");
    } else if (location.state?.fromRegistration) {
      setMessage("We have sent you a verification link. Please check your email and click the link to activate your account.");
    } else {
      setMessage("Please check your email for a verification link and click it to activate your account.");
    }
  }, [location.state]);

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
            {email
              ? `We sent a verification link to ${email}. Please click the link in your email to verify your account.`
              : "We sent you a verification link. Please check your email and click the link to activate your account."}
          </p>
        </div>

        <SuccessMessage message={message} onDismiss={() => setMessage("")} />
        <ErrorMessage message={error} />

        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
            Open your email inbox and click the verification link we sent to complete your registration.
          </p>

          {email && (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 bg-primary hover:bg-primaryHover text-white py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading && (
                <Box sx={{ display: "flex" }}>
                  <CircularProgress size={20} color="inherit" />
                </Box>
              )}
              {loading ? "Sending..." : "Resend verification email"}
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full text-sm text-primary hover:text-primaryHover font-medium hover:underline transition"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;

