"use client";
import { motion } from "framer-motion";

import { memo } from "react";

const WelcomeChatView = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4">
      <div className="text-center">
        <motion.h1
          initial={{ y: 80, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "tween" }}
          className="text-4xl mb-2 will-change-[transform,opacity]"
        >
          How can I help you today?
        </motion.h1>
        <motion.p
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "tween" }}
          className="max-w-sm mx-auto text-slate-400 will-change-[transform,opacity]"
        >
          I&apos;m a chatbot trained to answer questions about ChatGPT and
          related topics. Feel free to ask me anything!
        </motion.p>
      </div>
    </div>
  );
};

export default memo(WelcomeChatView);
