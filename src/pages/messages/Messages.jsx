import React from "react";

const Messages = () => {
  return (
    <div className="min-h-screen w-full bg-neutral-100 dark:bg-neutral-950">
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-5 py-5 space-y-4">
        <header className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-4 sm:px-5 sm:py-4 shadow-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                Messages
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Chat with your specialists and care team.
              </p>
            </div>
          </div>
        </header>

        <section
          className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 py-12 px-4 text-center shadow-sm"
          aria-label="Messages content"
        >
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Messages view coming soon...
          </p>
        </section>
      </div>
    </div>
  );
};

export default Messages;



