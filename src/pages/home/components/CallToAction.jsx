import React from "react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="bg-blue-50 dark:bg-gray-800 py-20">
      <div className="mx-auto max-w-screen-md px-6 text-center">
        <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Join as a Mental Health Professional
        </h2>

        <p className="mb-8 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
          Provide care, manage your patients, and grow your practice securely on
          our platform.
        </p>

        <Link to="/register">
          <button className="rounded-full bg-indigo-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all duration-500 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800">
            Apply to Register
          </button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
