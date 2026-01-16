import React, { useState, useEffect, useRef } from "react";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ShieldIcon from "@mui/icons-material/Shield";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import GroupsIcon from "@mui/icons-material/Groups";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";

const Benefits = () => {
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

  const benefits = [
    {
      icon: LocalHospitalIcon,
      title: "Medical Doctors & Mental Health Professionals",
      description: "Access both medical consultations and mental health therapy in one convenient platform. Book appointments with verified doctors or licensed therapists whenever you need care.",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      keywords: "online doctor appointment, telehealth, medical consultation, online therapy"
    },
    {
      icon: ShieldIcon,
      title: "HIPAA-Compliant Secure Platform",
      description: "Your health information is protected with bank-level encryption. HIPAA-compliant security ensures complete privacy and confidentiality for all your medical and mental health records.",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900",
      keywords: "HIPAA compliant, secure therapy, privacy protection"
    },
    {
      icon: TrendingUpIcon,
      title: "Mood Tracking for Mental Therapy",
      description: "Visualize your emotional journey with daily mood tracking. Identify patterns, track improvements, and share insights with your mental health professional for better treatment outcomes.",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      keywords: "mood tracking for therapy, mental health monitoring, mental medicine tracking"
    },
    {
      icon: SmartToyIcon,
      title: "AI-Powered Mental Health Assistant",
      description: "Get personalized, 24/7 support with AI-powered recommendations. Our assistant helps with mindfulness exercises, habit building, and scheduling—tailored specifically for mental therapy needs.",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900",
      keywords: "AI therapy assistant, mental medicine AI, mental health AI tools"
    },
    {
      icon: GroupsIcon,
      title: "Community Support Network",
      description: "Join a safe, moderated community of people on similar journeys. Share experiences, find encouragement, and build connections with others who understand what you're going through.",
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-100 dark:bg-pink-900",
      keywords: "mental health community, peer support, online support groups"
    },
    {
      icon: SelfImprovementIcon,
      title: "Mental Health Wellness Tools",
      description: "Access guided meditation, breathing exercises, and mindfulness practices designed by mental health professionals. These tools complement your therapy sessions and support long-term wellness.",
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-100 dark:bg-teal-900",
      keywords: "mental therapy tools, mental medicine resources, mindfulness for therapy"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative bg-gradient-to-b from-blue-50/40 via-white to-slate-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 py-12 md:py-16 lg:py-20 overflow-hidden"
      role="region"
      aria-labelledby="benefits-heading"
    >
      <div className="relative mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <h2 
            id="benefits-heading"
            className={`mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Why Choose Clean Mind
          </h2>
          <p 
            className={`text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Medical consultations and mental health care in one platform. Digital tools for mood tracking, AI assistance, and wellness support your mental therapy journey.
          </p>
        </div>

        <div className="grid gap-8 md:gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <article
                key={index}
                className={`group bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-500 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 hover:-translate-y-1 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                role="article"
              >
                <div className={`w-14 h-14 ${benefit.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`${benefit.color} text-3xl`} />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
