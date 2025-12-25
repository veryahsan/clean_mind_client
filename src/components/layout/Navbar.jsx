import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserAvatar from "../layout/UserAvatar";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoutHandler = () => {
    logout();
    setIsProfileMenuOpen(false);
    setIsNotificationOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register", isButton: true },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border-b border-white/10 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <RouterLink
            to="/"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            CleanMind
          </RouterLink>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-4 items-center">
            {!isAuthenticated ? (
              navLinks.map((link) =>
                link.isButton ? (
                  <RouterLink
                    key={link.name}
                    to={link.path}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition"
                  >
                    {link.name}
                  </RouterLink>
                ) : (
                  <RouterLink
                    key={link.name}
                    to={link.path}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition"
                  >
                    {link.name}
                  </RouterLink>
                )
              )
            ) : (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen((prev) => !prev)}
                  className="relative rounded-full p-2 text-blue-500 hover:text-blue-600 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                >
                  <span className="sr-only">View notifications</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-6 h-6"
                  >
                    <path
                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-10 w-64 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                      No new notifications
                    </div>
                  </div>
                )}

                {/* Profile */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                    className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <UserAvatar username={user?.username} />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <RouterLink
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Your Profile
                        </RouterLink>
                        <RouterLink
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Settings
                        </RouterLink>
                        <button
                          onClick={logoutHandler}
                          className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 dark:text-gray-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900">
          {!isAuthenticated ? (
            navLinks.map((link) =>
              link.isButton ? (
                <RouterLink
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-green-600 hover:bg-green-700 text-white transition"
                >
                  {link.name}
                </RouterLink>
              ) : (
                <RouterLink
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition"
                >
                  {link.name}
                </RouterLink>
              )
            )
          ) : (
            <>
              <button
                onClick={() => setIsNotificationOpen((prev) => !prev)}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-500 hover:text-blue-600"
              >
                Notifications
              </button>
              <RouterLink
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Your Profile
              </RouterLink>
              <RouterLink
                to="/settings"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Settings
              </RouterLink>
              <button
                onClick={logoutHandler}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
