"use client";

import { Message } from "ai/react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import MessagesList from "@/components/messages-list";

type Props = {
  messages: Message[];
  isLoading: boolean;
};

const MessagesView = forwardRef(({ messages, isLoading }: Props, ref) => {
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  useImperativeHandle(
    ref,
    () => {
      return {
        scrollToBottom: () => {
          isAtBottomRef.current = true;
          setTimeout(() => {
            if (!chatWindowRef.current) return;
            chatWindowRef.current.scrollTo({
              top: chatWindowRef.current.scrollHeight,
              behavior: "smooth",
            });
          }, 100);
        },
        scrollToTop: () => {
          console.log("scroll to top");
          isAtBottomRef.current = false;
          if (!chatWindowRef.current) return;
          chatWindowRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        },
        atTop: (callback: (atTop: boolean) => void) => {
          if (!chatWindowRef.current) return;
          callback(chatWindowRef.current.scrollTop === 0);
        },
        atBottom: (callback: (atBottom: boolean) => void) => {
          if (!chatWindowRef.current) return;
          return callback(
            chatWindowRef.current.scrollTop +
              chatWindowRef.current.clientHeight >=
              chatWindowRef.current.scrollHeight - 5
          );
        },

        onScroll: (callback: (scrollPosition: number) => void) => {
          if (!chatWindowRef.current) return;
          const element = chatWindowRef.current;
          element.addEventListener("scroll", () => {
           depounce(() => {
              callback(element.scrollTop);
            }, 100)();
          });
        },
      };
    },
    []
  );

  useEffect(() => {
    const chatWindowElement = chatWindowRef.current;
    if (!chatWindowElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatWindowElement;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

      isAtBottomRef.current = isAtBottom;
    };

    chatWindowElement.addEventListener("scroll", handleScroll);

    return () => {
      chatWindowElement.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading]);

  useEffect(() => {
    const chatWindowElement = chatWindowRef.current;
    if (isAtBottomRef.current && isLoading) {
      throttle(() => {
        if (!chatWindowElement) return;
        chatWindowElement.scrollTop = chatWindowElement.scrollHeight;
      }, 100)();
    }
  }, [isAtBottomRef, isLoading, messages]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      isAtBottomRef.current = true;
    }
  }, []);

  return (
    <ScrollArea
      type="scroll"
      className="flex-grow flex flex-col-reverse overflow-y-auto"
      ref={chatWindowRef}
    >
      <div className="max-w-[50rem] mx-auto p-3">
        <MessagesList messages={messages} isLoading={false} />
      </div>
      <ScrollBar className="scrollarea__bar" />
    </ScrollArea>
  );
});

MessagesView.displayName = "MessagesView";

export default memo(MessagesView);

const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function throttled(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const depounce = (func: Function, wait: number) => {
  let timeout: number;
  return function debounced(this: any, ...args: any[]) {
    const context = this;
    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
