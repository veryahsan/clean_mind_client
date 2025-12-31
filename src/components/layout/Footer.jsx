import React from "react";
import { useModal } from "../../context/ModalContext";
import { useAuth } from "../../context/AuthContext";
import ContactModal from "../../modals/ContactModal";
import Logo from "../../assets/logo.png";

const Footer = () => {
  const { openModal } = useModal();
  const { isAuthenticated } = useAuth();

  // Minimal footer for authenticated users
  if (isAuthenticated) {
    return (
      <footer className="w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © 2026 CleanMind, Inc.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition">
                Terms
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition">
                Privacy
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition">
                Security
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition">
                Status
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition">
                Community
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition">
                Docs
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition">
                Contact
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition">
                Manage cookies
              </a>
              <span className="text-gray-600 dark:text-gray-400">
                Do not share my personal information
              </span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Full footer for non-authenticated users

  return (
    <footer className="w-full bg-white dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 gap-y-8 md:gap-8 py-10 max-w-sm mx-auto sm:max-w-3xl lg:max-w-full">
          <div className="col-span-full mb-10 lg:col-span-2 lg:mb-0 text-center lg:text-left">
            <a
              href="#"
              className="flex justify-center lg:justify-start font-medium"
            >
              <img src={Logo} alt="CleanMind Logo" className="h-24 w-auto" />
            </a>

            <p className="py-4 text-sm text-gray-500">
              Trusted in more than 100 countries & 5 million customers. Have any
              query?
            </p>

            <button
              onClick={() => openModal(<ContactModal />)}
              className="py-2.5 px-5 h-9 inline-block bg-indigo-600 rounded-full shadow-sm text-xs text-white transition-all duration-500 hover:bg-indigo-700"
            >
              Contact us
            </button>
          </div>

          <div className="text-left">
            <h4 className="text-lg text-gray-900 font-medium mb-7">
              CleanMind
            </h4>
            <ul className="text-sm">
              <li className="mb-6">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Home
                </a>
              </li>
              <li className="mb-6">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-lg text-gray-900 font-medium mb-7">
              Follow Us
            </h4>
            <ul className="text-sm">
              <li className="mb-6">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Instagram
                </a>
              </li>
              <li className="mb-6">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-lg text-gray-900 font-medium mb-7">Support</h4>
            <ul className="text-sm">
              <li className="mb-6">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Customer Support
                </a>
              </li>
              <li className="mb-6">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-lg text-gray-900 font-medium mb-7">
              Subscribe
            </h4>
            <p className="text-sm text-gray-500 leading-6 mb-7">
              Subscribe to get the latest news from us
            </p>
            <a
              href="#"
              className="flex items-center justify-center gap-2 border border-blue-50 rounded-full py-3 px-6 w-fit text-sm text-indigo-600 font-semibold transition-all duration-500 hover:bg-indigo-50"
            >
              Subscribe
              <svg
                width="15"
                height="12"
                viewBox="0 0 15 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.25 6L13.25 6M9.5 10.5L13.4697 6.53033C13.7197 6.28033 13.8447 6.15533 13.8447 6C13.8447 5.84467 13.7197 5.71967 13.4697 5.46967L9.5 1.5"
                  stroke="#4F46E5"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="py-7 border-t border-gray-200 flex flex-col lg:flex-row items-center justify-center lg:justify-between">
          <span className="text-sm text-gray-500 mb-4 lg:mb-0">
            © <a href="#">CleanMind</a> 2026, All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
