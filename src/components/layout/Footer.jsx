import React from "react";
import { useModal } from "../../context/ModalContext";
import { useAuth } from "../../context/AuthContext";
import ContactModal from "../../modals/ContactModal";
import Logo from "../../assets/logo.png";

const Footer = () => {
  const { openModal } = useModal();
  const { isAuthenticated } = useAuth();

  // No footer for authenticated users (moved to sidebar)
  if (isAuthenticated) {
    return null;
  }

  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left side - Logo and Links */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <img src={Logo} alt="CleanMind Logo" className="h-8 w-auto opacity-60" />
            
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <button
                onClick={() => openModal(<ContactModal />)}
                className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                Contact
              </button>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                Terms
              </a>
            </div>
          </div>

          {/* Right side - Copyright */}
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} CleanMind. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
