import React from "react";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Benefits from "./components/Benefits";
import HowItWorks from "./components/HowItWorks";
import FAQ from "./components/FAQ";
import CallToAction from "./components/CallToAction";

const Home = () => {
  // Structured Data for SEO (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Clean Mind",
    "description": "Healthcare platform offering medical consultations with licensed doctors and mental health services with verified professionals. Includes specialized digital tools for mental therapy and mental medicine.",
    "url": "https://cleanmind.app",
    "logo": "https://cleanmind.app/logo.png",
    "sameAs": [
      "https://facebook.com/cleanmind",
      "https://twitter.com/cleanmind",
      "https://linkedin.com/company/cleanmind"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@cleanmind.app"
    },
    "offers": {
      "@type": "Service",
      "name": "Healthcare & Mental Health Services",
      "description": "Book appointments with verified medical doctors for general healthcare and connect with licensed psychiatrists and mental health professionals. Access specialized AI assistant, mood tracking, and wellness tools for mental therapy and mental medicine.",
      "provider": {
        "@type": "Organization",
        "name": "Clean Mind"
      }
    }
  };

  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Clean Mind Healthcare Services",
    "description": "Healthcare platform offering medical consultations and mental health care services",
    "medicalSpecialty": "General Medicine, Psychiatry, Mental Health Counseling",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "url": "https://cleanmind.app"
  };

  return (
    <main role="main" itemScope itemType="https://schema.org/WebPage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
      />
      <Hero />
      <Features />
      <Benefits />
      <HowItWorks />
      <FAQ />
      <CallToAction />
    </main>
  );
};

export default Home;
