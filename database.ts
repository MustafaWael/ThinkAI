import { Message } from "ai/react";

export const messages: Message[] = [];

export const getMessages =  () => {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  return messages;
};

export const addMessage =  (message: Message) => {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  messages.push(message);
};
