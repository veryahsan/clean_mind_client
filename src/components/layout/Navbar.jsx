import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../assets/logo.png";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  // Don't show navbar when authenticated
  if (isAuthenticated) {
    return null;
  }

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register", isButton: true },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border-b border-white/10 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          {/* Left Side - Logo */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <RouterLink to="/" className="inline-flex items-center flex-shrink-0">
              <img src={Logo} alt="CleanMind Logo" className="h-16 w-auto" />
              <span className="text-2xl font-semibold font-sans text-gray-900 dark:text-white tracking-tight">
                CleanMind
              </span>
            </RouterLink>
          </div>

          {/* Right Side - Desktop Links */}
          <div className="hidden md:flex space-x-4 items-center flex-shrink-0">
            {navLinks.map((link) =>
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
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
