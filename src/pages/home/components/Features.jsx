import React from "react";
import features from "../../../constants/features";

const Features = () => (
  <section className="bg-white dark:bg-gray-900 py-20">
    <div className="mx-auto max-w-screen-xl px-4 lg:px-8 text-center">
      <div className="mx-auto max-w-screen-md mb-16">
        <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          A Better Way to Care for Your Mental Health
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400">
          Get the support you need through trusted professionals, a
          compassionate community, and smart tools that adapt to your life.
        </p>
      </div>

      <div className="grid gap-y-10 gap-x-6 sm:gap-x-8 md:gap-x-10 lg:gap-x-14 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-stretch">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className={`flex flex-col items-center text-center rounded-2xl p-8 ${feature.bg} ${feature.hover} transition min-h-[250px] sm:min-h-[280px] md:min-h-[300px]`}
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full ${feature.iconBg}`}
              >
                <Icon className={feature.color} fontSize="large" />
              </div>
              <h3 className="mb-2 text-xl font-semibold dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Features;
