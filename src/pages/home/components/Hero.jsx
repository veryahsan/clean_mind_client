import React from "react";

const Hero = () => (
  <section className="bg-gradient-to-b from-blue-100 to-white dark:from-gray-800 dark:to-gray-950 py-16 sm:py-20 px-4 text-center">
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
        Care for Your Mind, When You Need It Most
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
        Your mind deserves the same care as your body. Start your journey
        towards emotional well-being today.
      </p>

      <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
        <a
          href="#resources"
          className="rounded-md bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 transition-all duration-300"
        >
          Learn More
        </a>
        <a
          href="#support"
          className="rounded-md border border-indigo-500 px-6 py-3 text-indigo-500 font-semibold hover:bg-indigo-100 transition-all duration-300"
        >
          Join the community
        </a>
      </div>
    </div>
  </section>
);

export default Hero;
