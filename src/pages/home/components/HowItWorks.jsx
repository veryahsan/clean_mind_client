import React, { useState, useEffect, useRef } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VideocamIcon from "@mui/icons-material/Videocam";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SpaIcon from "@mui/icons-material/Spa";

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
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

  const steps = [
    {
      number: "01",
      icon: PersonAddIcon,
      title: "Create Your Account",
      description: "Sign up in minutes with just your email. Complete your profile to personalize your healthcare experience and get started immediately.",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      number: "02",
      icon: SearchIcon,
      title: "Browse Professionals",
      description: "Explore our directory of verified medical doctors, psychiatrists, and therapists. Read profiles, specialties, and reviews to find your perfect match.",
      color: "text-indigo-600 dark:text-indigo-400"
    },
    {
      number: "03",
      icon: CalendarTodayIcon,
      title: "Schedule Appointment",
      description: "Choose a convenient time slot that fits your schedule. Our smart calendar shows available appointments and sends automatic reminders.",
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      number: "04",
      icon: VideocamIcon,
      title: "Attend Video Sessions",
      description: "Join secure, high-quality video consultations from anywhere. All sessions are HIPAA-compliant with end-to-end encryption for your privacy.",
      color: "text-green-600 dark:text-green-400"
    },
    {
      number: "05",
      icon: AssessmentIcon,
      title: "Track Mental Health Progress",
      description: "Use our specialized mood tracking tool to log daily emotions and identify patterns. Share progress reports with your mental health professional for better insights.",
      color: "text-pink-600 dark:text-pink-400"
    },
    {
      number: "06",
      icon: SpaIcon,
      title: "Access Wellness Resources",
      description: "Practice guided meditation, breathing exercises, and mindfulness techniques. Get personalized AI recommendations to support your mental therapy journey.",
      color: "text-teal-600 dark:text-teal-400"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative bg-gradient-to-b from-blue-50/40 via-white to-slate-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 py-12 md:py-16 lg:py-20 overflow-hidden"
      role="region"
      aria-labelledby="how-it-works-heading"
    >
      <div className="relative mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <h2 
            id="how-it-works-heading"
            className={`mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            How It Works
          </h2>
          <p 
            className={`text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Book medical appointments or mental health sessions in six simple steps. Track progress with specialized tools and access wellness resources.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line for visual flow (hidden on mobile) */}
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-teal-200 dark:from-blue-800 dark:via-indigo-800 dark:to-teal-800 opacity-30"></div>
          
          <div className="grid gap-8 md:gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article
                  key={index}
                  className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-500 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 hover:-translate-y-2 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  role="article"
                >
                  {/* Step number badge */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300 z-10">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="mt-4 mb-6 flex items-center gap-4">
                    <div className={`w-12 h-12 ${step.color} bg-opacity-10 dark:bg-opacity-20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={step.color} fontSize="large" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <div 
          className={`mt-12 md:mt-16 text-center transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Ready to book a medical consultation or start your mental health journey?
          </p>
          <a
            href="/register"
            className="inline-block rounded-lg bg-indigo-600 px-8 py-4 text-white font-semibold hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-indigo-500/50"
            aria-label="Sign up for Clean Mind therapy platform"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
