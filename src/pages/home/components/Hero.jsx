import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section 
      className="relative bg-gradient-to-br from-blue-100 via-indigo-100 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-indigo-900/30 dark:to-gray-900 py-12 sm:py-16 md:py-20 lg:py-24 px-4 text-center overflow-hidden"
      role="banner"
      aria-label="Hero section"
    >
      {/* Smooth fade-out at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 dark:to-transparent pointer-events-none"></div>
      
      <div className="relative mx-auto max-w-4xl">
        <h1 
          className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Online Healthcare with{" "}
          <span className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent font-extrabold">
            Medical Doctors
          </span>
          {" "}&{" "}
          <span className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent font-extrabold">
            Mental Health Professionals
          </span>
        </h1>

        <p 
          className={`text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 md:mb-12 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Book appointments with medical doctors and mental health professionals. Access specialized mental health tools including mood tracking, AI assistant, and mindfulness exercises for mental therapy support.
        </p>

        <div 
          className={`mt-6 sm:mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Link
            to="/register"
            className="group rounded-lg bg-indigo-600 px-8 py-4 text-white font-semibold hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-indigo-500/50 flex items-center justify-center gap-2"
            aria-label="Get started with Clean Mind"
          >
            Get Started
            <svg 
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a
            href="#features"
            className="rounded-lg border-2 border-indigo-500 dark:border-indigo-400 px-8 py-4 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300 transform hover:scale-105"
            aria-label="Learn more about our features"
          >
            Learn More
          </a>
        </div>

        {/* Trust indicators */}
        <div 
          className={`mt-12 md:mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Verified Professionals</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>AI-Powered Tools</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
