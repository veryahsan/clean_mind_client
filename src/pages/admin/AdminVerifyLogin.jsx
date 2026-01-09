import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import api from "../../services/api";
import moodApi from "../../services/moodApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminVerifyLogin = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hasVerifiedRef = React.useRef(false);

  useEffect(() => {
    if (hasVerifiedRef.current || !token) {
      if (!token) {
        setError("Invalid verification link.");
        setLoading(false);
      }
      return;
    }

    const verifyToken = async () => {
      if (hasVerifiedRef.current) {
        return;
      }
      hasVerifiedRef.current = true;

      try {
        setLoading(true);
        setError("");

        const response = await api.get(`admin/verify-login/${token}/`);
        const responseData = response.data;

        if (responseData.success && responseData.data) {
          const access = responseData.data.access;
          const refresh = responseData.data.refresh;

          if (access) {
            localStorage.setItem("access_token", access);
            if (refresh) {
              localStorage.setItem("refresh_token", refresh);
            }

            await checkAuth();

            try {
              const decoded = jwtDecode(access);
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
              navigate("/admin", { replace: true });
            }
          } else {
            setError("Failed to complete login. Please try again.");
          }
        } else {
          setError(responseData.message || "Verification failed. Please try logging in again.");
        }
      } catch (err) {
        const errorData = err.response?.data;
        const errorMessage = errorData?.message || "Verification link is invalid or has expired. Please try logging in again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, navigate, checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader fullScreen={false} size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8 md:p-10 text-center">
        <ErrorMessage message={error} />
        {error && (
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminVerifyLogin;

