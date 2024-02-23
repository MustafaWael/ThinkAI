import { getChat } from "@/actions";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { StreamingTextResponse, Message as VercelChatMessage } from "ai";
import { AIMessage, ChatMessage, HumanMessage } from "@langchain/core/messages";
import { DynamicTool } from "@langchain/core/tools";
import { auth } from "@/auth";
import { Calculator } from "langchain/tools/calculator";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor } from "langchain/agents";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isNewChat = (chatId: string) => chatId === "new-chat";

export async function generateChatPageMetadata({
  params,
}: {
  params: { chatId: string };
}) {
  const chatId = params.chatId;

  if (!isNewChat(chatId) || !chatId) {
    const chat = await getChat(chatId);
    return {
      title: chat.name || "Unnamed Chat",
    };
  }

  return {
    title: "ThinkAI",
  };
}

type LangChainMessage = AIMessage | ChatMessage | HumanMessage;

export const convertVercelMessageToLangChainMessage = (
  message: VercelChatMessage
) => {
  if (message.role === "user") {
    return new HumanMessage(message.content);
  } else if (message.role === "assistant") {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};

/**
 * Filters messages based on the role
 * @param messages - Array of messages
 * @returns Filtered array of messages
 */
export function filterMessagesByRole(
  messages: VercelChatMessage[]
): VercelChatMessage[] {
  return messages.filter(
    (message: VercelChatMessage) =>
      message.role === "user" || message.role === "assistant"
  );
}

/**
 * Extracts and converts previous messages using the provided converter function
 * @param messages - Array of messages
 * @param converter - Function to convert messages
 * @returns Array of converted previous messages
 */
export function extractAndConvertPreviousMessages(
  messages: VercelChatMessage[],
  converter: (message: VercelChatMessage) => LangChainMessage
): LangChainMessage[] {
  const previousMessages = messages.slice(0, -1).map(converter);
  return previousMessages;
}

export const getCurrentDate = async () => {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false, // Set to 24-hour format
  };
  return currentDate.toLocaleString("en-US", options);
};

export const current_date_time_tool = new DynamicTool({
  name: "current_date_time",
  description: "Get the current date and time",
  func: () => getCurrentDate(),
});
