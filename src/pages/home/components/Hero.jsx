import React from "react";

const Hero = () => (
  <section className="bg-blue-50 dark:bg-gray-900 py-20 px-4 text-center">
    <div className="mx-auto max-w-3xl">
      <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
        Mental Health Matters
      </h1>
      <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8">
        Your mind deserves the same care as your body. Start your journey
        towards emotional well-being today.
      </p>

      <div className="mt-10 flex justify-center gap-6">
        <a
          href="#resources"
          className="rounded-md bg-indigo-500 px-6 py-3 text-white font-semibold hover:bg-indigo-400 transition"
        >
          Learn More
        </a>
        <a
          href="#support"
          className="rounded-md border border-indigo-500 px-6 py-3 text-indigo-500 font-semibold hover:bg-indigo-100 transition"
        >
          Join the community
        </a>
      </div>
    </div>
  </section>
);

export default Hero;
