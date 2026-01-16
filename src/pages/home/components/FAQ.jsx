import React, { useState, useEffect, useRef } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
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

  const faqs = [
    {
      question: "What is Clean Mind and what services do you offer?",
      answer: "Clean Mind is a comprehensive healthcare platform offering both medical consultations and mental health services. You can book appointments with verified medical doctors for general healthcare, as well as schedule sessions with licensed psychiatrists and mental health professionals for therapy. Our specialized digital tools—including AI assistant, mood tracking, and wellness resources—are designed specifically for mental therapy and mental medicine to support your mental health journey. All services are HIPAA-compliant and secure."
    },
    {
      question: "Can I book appointments with medical doctors on this platform?",
      answer: "Yes! Clean Mind offers medical consultations with verified and licensed medical doctors in addition to mental health services. You can book appointments for general healthcare consultations through our secure platform. All medical professionals are verified and credentialed before joining our platform."
    },
    {
      question: "Are the therapists and psychiatrists licensed and verified?",
      answer: "Yes, all mental health professionals on Clean Mind are verified, licensed, and credentialed. We conduct thorough background checks and verify professional licenses before allowing therapists to join our platform. You can trust that you're receiving care from qualified mental health experts."
    },
    {
      question: "Is online therapy as effective as in-person therapy?",
      answer: "Research shows that online therapy can be just as effective as in-person therapy for many mental health conditions, including anxiety, depression, and stress management. Online therapy offers additional benefits like convenience, accessibility, and comfort of being in your own space. Our platform provides the same quality of care as traditional therapy with added digital tools for enhanced support."
    },
    {
      question: "What are the digital wellness tools and are they only for mental health?",
      answer: "Our digital wellness tools—including the AI assistant, mood tracker, and mindfulness exercises—are specifically designed for mental therapy and mental medicine. These tools help track your mental health progress, provide personalized recommendations for mindfulness practices, and support your mental health treatment plan. While our platform offers both medical consultations and mental health services, these digital tools are specialized features for mental health care."
    },
    {
      question: "How does mood tracking work and why is it important for mental therapy?",
      answer: "Our mood tracking feature is a specialized tool for mental therapy and mental medicine. It allows you to log your daily emotional state, helping you identify patterns in your mental health over time. This data helps both you and your mental health professional understand your progress, triggers, and improvements. Regular mood tracking provides valuable insights for personalized mental health treatment plans."
    },
    {
      question: "Is my information secure and private?",
      answer: "Absolutely. Clean Mind uses bank-level encryption and is fully HIPAA-compliant. All your mental health records, therapy sessions, and personal information are protected with the highest security standards. We never share your information with third parties without your explicit consent."
    },
    {
      question: "What payment methods are accepted for therapy sessions?",
      answer: "We accept various secure payment methods including credit cards, debit cards, and digital payment platforms. All payments are processed securely through encrypted channels. You can view pricing and payment options when scheduling your session with a mental health professional."
    },
    {
      question: "Can I access the platform on mobile devices?",
      answer: "Yes, Clean Mind is fully responsive and works seamlessly on desktop computers, tablets, and mobile phones. You can access therapy sessions, mood tracking, mindfulness exercises, and community features from any device with an internet connection."
    },
    {
      question: "How do I get started with Clean Mind?",
      answer: "Getting started is easy! Simply register for an account, complete your profile, and browse available mental health professionals. You can schedule your first therapy session, start tracking your mood, access mindfulness resources, and join the community—all within minutes of signing up."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative bg-gradient-to-b from-slate-50 via-gray-50 to-blue-50/40 dark:from-gray-900 dark:via-gray-850 dark:to-gray-800 py-12 md:py-16 lg:py-20 overflow-hidden"
      role="region"
      aria-labelledby="faq-heading"
    >
      <div className="relative mx-auto max-w-4xl px-4 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 
            id="faq-heading"
            className={`mb-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Frequently Asked Questions
          </h2>
          <p 
            className={`text-base sm:text-lg text-gray-600 dark:text-gray-400 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Common questions about medical appointments, therapy services, and mental health tools.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <article
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-500 overflow-hidden ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
                  {faq.question}
                </h3>
                <svg
                  className={`w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
