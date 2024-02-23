"use client";
import { Message } from "ai/react";
import MessagesListItem from "@/components/messages-list-item";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  messages: Message[];
  isLoading: boolean;
};

export default function MessagesList({ messages }: Props) {
  return (
    <>
      <AnimatePresence initial={false}>
        <ul className="flex flex-col gap-y-3">
          {messages.map((message, i) => (
            <motion.li
              key={message.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <MessagesListItem message={message} />
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
    </>
  );
}
