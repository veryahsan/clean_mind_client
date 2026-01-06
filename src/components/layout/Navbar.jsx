import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import UserAvatar from "../layout/UserAvatar";
import Logo from "../../assets/logo.png";
import LogoutModal from "../../modals/LogoutModal";
import DailyQuoteCapsule from "../common/DailyQuoteCapsule";

const Navbar = ({ sidebarOpen, setSidebarOpen, sidebarWidth = 256, isDesktop = false }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { openModal } = useModal();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    // Use navigate for smooth transition instead of window.location.href
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  };

  const handleLogoutClick = () => {
    setIsProfileMenuOpen(false);
    openModal(<LogoutModal onConfirm={handleLogoutConfirm} />);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register", isButton: true },
  ];

  return (
    <nav 
      className={`sticky top-0 z-50 backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border-b border-white/10 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out ${
        isAuthenticated ? "lg:ml-64" : ""
      }`}
      style={isAuthenticated && isDesktop ? { marginLeft: `${sidebarWidth}px` } : {}}
    >
      <div className={`${isAuthenticated ? "w-full" : "max-w-7xl mx-auto"} px-4 sm:px-6 lg:px-8`}>
        <div className="flex justify-between h-16 items-center gap-4">
          {/* Left Side - Logo and Quote */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Logo - Show with text when NOT authenticated, logo only on mobile when authenticated */}
            {!isAuthenticated ? (
              <RouterLink to="/" className="inline-flex items-center flex-shrink-0">
                <img src={Logo} alt="CleanMind Logo" className="h-16 w-auto" />
                <span className="text-2xl font-semibold font-sans text-gray-900 dark:text-white tracking-tight">
                  CleanMind
                </span>
              </RouterLink>
            ) : (
              <>
                <RouterLink to="/dashboard" className="lg:hidden inline-flex items-center flex-shrink-0">
                  <img src={Logo} alt="CleanMind Logo" className="h-12 w-auto" />
                </RouterLink>
                {/* Daily Quote Capsule - Left side for authenticated users (only on desktop) */}
                <div className="hidden lg:block flex-1 min-w-0 max-w-2xl">
                  <DailyQuoteCapsule maxWidth="100%" />
                </div>
              </>
            )}
          </div>

          {/* Right Side - Desktop Links */}
          <div className="hidden md:flex space-x-4 items-center flex-shrink-0">
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
                {/* Profile */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                    className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <UserAvatar 
                      username={user?.username} 
                      headshot={user?.headshot} 
                      has_headshot={user?.has_headshot}
                      size={40} 
                    />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        {/* User Name Display */}
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.first_name && user?.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : user?.username || "User"}
                          </p>
                          {user?.email && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {user.email}
                            </p>
                          )}
                        </div>
                        <RouterLink
                          to="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Your Profile
                        </RouterLink>
                        <RouterLink
                          to="/settings"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Settings
                        </RouterLink>
                        <button
                          onClick={handleLogoutClick}
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

          {/* Mobile Sidebar Toggle Button */}
          {isAuthenticated && (
            <div className="lg:hidden flex items-center">
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex justify-center items-center size-10 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200 transition"
                aria-label="Toggle navigation"
              >
                <svg
                  className="shrink-0 size-6"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M15 3v18" />
                  <path d="m10 15-3-3 3-3" />
                </svg>
                <span className="sr-only">Navigation Toggle</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
