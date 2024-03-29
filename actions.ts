"use server";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "./auth";
import { revalidatePath, revalidateTag, unstable_noStore } from "next/cache";
import { chatDB } from "./database/drizzle-chat-client";
import { chats, messages } from "./database/drizzle-chat-schema";
import { asc, desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export const signInWithEmail = async (formData: FormData) => {
  const email = formData.get("email") as string;
  try {
    await signIn("email", { email, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      console.log("🚀 ~ login ~ error:", error);
    }
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    await signIn("google", { redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      console.log({ error });
    }
    throw error;
  }
};

export const signInWithGithub = async () => {
  try {
    await signIn("github", { redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      console.log({ error });
    }
    throw error;
  }
};

export const signout = async () => {
  try {
    await signOut();
  } catch (error) {
    if (error instanceof AuthError) {
      console.log("🚀 ~ logout ~ error:", error);
    }

    throw error;
  }
};

export const sendMessage = async (formData: FormData) => {
  const message = formData.get("message") as unknown as string;
  try {
    console.log("Loading message 🔃");
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // push message to database
    console.log("🚀 ~ sendMessage ~ message", message);
    revalidatePath("/chat");
  } catch (error) {
    console.log("🚀 ~ sendMessage ~ error", error);
    throw error;
  }
};

export const createChat = async (name: string) => {
  const session = await auth();
  const chatId = crypto.randomUUID();
  console.log("🚀 ~ createChat ~ chatId", chatId);
  console.log("🚀 ~ createChat ~ name", name);

  await chatDB.insert(chats).values({
    ownerId: session?.user?.id!,
    id: chatId,
    createdAt: new Date(),
    name,
  });

  return chatId;
};

export const getChat = async (chatId: string) => {
  const chat = await chatDB.query.chats.findFirst({
    where: eq(chats.id, chatId),
  });

  if (!chat || chat.name === undefined) {
    notFound();
  }

  return chat;
};

export const createMessages = async ({
  chatId,
  prompt,
  completion,
}: {
  chatId: string;
  prompt: string;
  completion: string;
}) => {
  await chatDB.insert(messages).values([
    {
      id: crypto.randomUUID(),
      chatId,
      content: prompt,
      role: "user",
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      chatId,
      content: completion,
      role: "assistant",
      createdAt: new Date(),
    },
  ]);
};

export const getUserChatsList = async (userId: string) =>
  await chatDB
    .select()
    .from(chats)
    .where(eq(chats.ownerId, userId))
    .orderBy(desc(chats.createdAt));

export const getChatMessages = async (chatId: string) => {
  // the chatId generated by `crypto.randomUUID()` is 36 characters long
  if (chatId?.length !== 36) {
    notFound();
  }
  const msgs = await chatDB
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(asc(messages.createdAt));

  if (msgs.length === 0) {
    notFound();
  }

  return msgs;
};

export const revalidateChatsList = async () => {
  revalidateTag("user-chats-list");
};

export const revalidateChatMessages = async (chatId: string) => {
  revalidateTag(`chat-messages-${chatId}`);
};

export const revalidateMessages = async () => {
  revalidatePath("/", "page");
};

export const revalidate = async (path: string) => {
  revalidatePath(path, "page");
};

export const deleteChatMessages = async (chatId: string) => {
  await chatDB.delete(messages).where(eq(messages.chatId, chatId));
  revalidateChatMessages(chatId);
};

export const deleteChat = async (chatId: string) => {
  await deleteChatMessages(chatId);
  await chatDB.delete(chats).where(eq(chats.id, chatId));
};
