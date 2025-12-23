import React from "react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="bg-blue-50 dark:bg-gray-800 py-20">
      <div className="mx-auto max-w-screen-md px-6 text-center">
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Join as a Mental Health Professional
        </h2>

        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Provide care, manage your patients, and grow your practice securely on
          our platform.
        </p>

        <Link to="/register">
          <button className="rounded-full bg-indigo-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
            Apply to Register
          </button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
