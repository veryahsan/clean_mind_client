import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ForumIcon from "@mui/icons-material/Forum";
import AssistantIcon from "@mui/icons-material/Assistant";


const Features = () => (
  <section className="bg-white dark:bg-gray-900 py-20">
    <div className="mx-auto max-w-screen-xl px-6 lg:px-8 text-center">
      <div className="mx-auto max-w-screen-md mb-16">
        <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Supporting Your Mental Well-Being
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Professional care, community support, and intelligent tools — all in
          one safe space.
        </p>
      </div>

      <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-3 place-items-center">
        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <FavoriteBorderIcon
              className="text-blue-600 dark:text-blue-300"
              fontSize="large"
            />
          </div>
          <h3 className="mb-2 text-xl font-semibold dark:text-white">
            Professional Care
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Connect with verified psychiatrists and mental-health professionals
            securely.
          </p>
        </div>

        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <EmojiEmotionsIcon
              className="text-green-600 dark:text-green-300"
              fontSize="large"
            />
          </div>
          <h3 className="mb-2 text-xl font-semibold dark:text-white">
            Paid Consultations
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Book sessions, handle payments smoothly, and focus entirely on
            healing.
          </p>
        </div>

        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
            <ForumIcon
              className="text-purple-600 dark:text-purple-300"
              fontSize="large"
            />
          </div>
          <h3 className="mb-2 text-xl font-semibold dark:text-white">
            Community Support
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Engage with a caring, moderated community that understands you.
          </p>
        </div>

        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
            <AssistantIcon
              className="text-teal-600 dark:text-teal-300"
              fontSize="large"
            />
          </div>
          <h3 className="mb-2 text-xl font-semibold dark:text-white">
            AI Personal Assistant
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Smart scheduling, habit building, and hobby planning tailored to
            you.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default Features;
