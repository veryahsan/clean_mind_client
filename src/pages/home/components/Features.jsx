import React, { useState, useEffect, useRef } from "react";
import features from "../../../constants/features";

const Features = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate cards sequentially
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...new Set([...prev, index])]);
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section 
      id="features"
      ref={sectionRef}
      className="relative bg-gradient-to-b from-slate-50 via-gray-50 to-blue-50/40 dark:from-gray-900 dark:via-gray-850 dark:to-gray-800 py-12 md:py-16 lg:py-20 overflow-hidden"
      role="region"
      aria-labelledby="features-heading"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
      
      <div className="relative mx-auto max-w-screen-xl px-4 lg:px-8 text-center">
        <div className="mx-auto max-w-screen-md mb-16 md:mb-20">
          <h2 
            id="features-heading"
            className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white"
          >
            Medical & Mental Health Services
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400">
            Book medical appointments and mental health therapy sessions. Our digital tools—mood tracking, AI assistant, and wellness resources—support your mental therapy journey.
          </p>
        </div>

        <div className="grid gap-y-10 gap-x-6 sm:gap-x-8 md:gap-x-10 lg:gap-x-14 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-stretch">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isVisible = visibleCards.includes(index);
            return (
              <article
                key={index}
                className={`flex flex-col items-center text-center rounded-2xl p-8 ${feature.bg} ${feature.hover} transition-all duration-500 min-h-[250px] sm:min-h-[280px] md:min-h-[300px] transform hover:scale-105 hover:shadow-xl ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                role="article"
                aria-labelledby={`feature-${index}-title`}
              >
                <div
                  className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full ${feature.iconBg} transform transition-transform duration-300 group-hover:scale-110`}
                  aria-hidden="true"
                >
                  <Icon 
                    className={`${feature.color} transform transition-transform duration-300 hover:rotate-12`} 
                    fontSize="large" 
                  />
                </div>
                <h3 
                  id={`feature-${index}-title`}
                  className="mb-3 text-xl font-semibold dark:text-white"
                >
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
