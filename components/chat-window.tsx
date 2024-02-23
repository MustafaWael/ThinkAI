"use client";
import { Message } from "@/database/drizzle-chat-schema";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { createChat, createMessages, revalidate } from "@/actions";
import MessageForm from "@/components/message-form";
import MessagesView from "@/components/messages-view";
import WelcomeChatView from "@/components/welcome-chat-view";
import ChatActions from "@/components/chat-actions";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  chatId: string | null;
  initialMessages: Message[];
};

export default function ChatWindow({ chatId, initialMessages }: Props) {
  const messagesViewRef = useRef<MessagesViewRef>(null);
  const chatIdRef = useRef(chatId);
  const pathname = usePathname();
  const router = useRouter();

  const {
    messages,
    handleSubmit,
    isLoading,
    handleInputChange,
    input,
    setMessages,
    stop,
  } = useChat({
    api: "/api/chat",
    initialMessages,
    async onFinish(message) {
      const currentChatId = chatIdRef.current as string;
      await createMessages({
        chatId: currentChatId,
        prompt: input,
        completion: message.content,
      });
      await revalidate("/");
      currentChatId && router.push(`/chat/${currentChatId}`, { scroll: false });

      if (messagesViewRef.current) {
        messagesViewRef.current.atBottom((atBottom) => {
          if (!atBottom) {
            toast("There are new messages. Dismise to scroll down.", {
              dismissible: true,
              onDismiss: () => messagesViewRef.current?.scrollToBottom(),
            });
          }
        });
      }
    },
    onResponse: async (response) => {
      if (response.ok) {
        if (!chatIdRef.current) {
          const newChatId = await createChat(input);
          chatIdRef.current = newChatId;
        }
      }
    },
    onError: (error) => {
      error = JSON.parse(error.message);
      if (error.message.search("maximum context length is 4097")) {
        const usedTokens = error.message
          .split(" ")
          .filter((word) => Number(word))[2];

        toast(
          <div>
            You have used {usedTokens} tokens out of 4096.{" "}
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "link" }),
                "p-0 m-0 w-auto h-auto"
              )}
            >
              Create
            </Link>{" "}
            new chat?{" "}
          </div>
        );
      }
    },
  });

  useEffect(() => {
    if (pathname === "/") {
      setMessages([]);
    }
  }, [pathname, setMessages]);

  const submitHandler = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      handleSubmit(e);
      messagesViewRef.current?.scrollToBottom();
    },
    [handleSubmit]
  );

  const scrollToTop = useCallback(() => {
    messagesViewRef.current?.scrollToTop();
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesViewRef.current?.scrollToBottom();
  }, []);

  const atBottom = useCallback((callback: (atBottom: boolean) => void) => {
    messagesViewRef.current?.atBottom(callback);
  }, []);

  const atTop = useCallback((callback: (atTop: boolean) => void) => {
    messagesViewRef.current?.atTop(callback);
  }, []);

  const onScroll = useCallback((callback: (scrollPosition: number) => void) => {
    messagesViewRef.current?.onScroll(callback);
  }, []);

  return (
    <div className="w-full h-full relative flex flex-col items-star p-1 gap-y-4">
      {messages.length === 0 ? (
        <WelcomeChatView />
      ) : (
        <MessagesView
          messages={messages}
          isLoading={isLoading}
          ref={messagesViewRef}
        />
      )}
      <div className="sticky left-0 top-full w-full px-3 pb-3 md:max-w-[50rem] md:mx-auto">
        {messages.length > 0 ? (
          <ChatActions
            isLoading={isLoading}
            scrollToBottom={scrollToBottom}
            scrollToTop={scrollToTop}
            atBottom={atBottom}
            atTop={atTop}
            onScroll={onScroll}
            pause={() => {
              stop();
              createMessages({
                chatId: chatId!,
                prompt: input,
                completion: messages[messages.length - 1].content,
              });
            }}
          />
        ) : null}
        <MessageForm
          chatId={chatId!}
          handleSubmit={submitHandler}
          loading={isLoading}
          onInputChange={handleInputChange}
          input={input}
        />
      </div>
    </div>
  );
}
