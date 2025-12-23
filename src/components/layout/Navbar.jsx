import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <RouterLink
            to="/"
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            Clean Mind
          </RouterLink>

          <div className="flex space-x-4">
            <RouterLink
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition"
            >
              Home
            </RouterLink>

            {!isAuthenticated ? (
              <>
                <RouterLink
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition"
                >
                  Login
                </RouterLink>

                <RouterLink
                  to="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition"
                >
                  Register
                </RouterLink>
              </>
            ) : (
              <>
                <RouterLink
                  to="/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition"
                >
                  Dashboard
                </RouterLink>

                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
