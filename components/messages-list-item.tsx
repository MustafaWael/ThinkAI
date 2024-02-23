"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Message } from "ai/react";
import ReactMarkdown, { type Components } from "react-markdown";
import CodeBlock from "@/components/code";
import clsx from "clsx";
import remarkGfm from "remark-gfm";
import { memo } from "react";
import { BotIcon } from "lucide-react";

const components = {
  code: ({ node, className, children, ...props }) => {
    const language = className?.replace("language-", "");
    const match = /language-(\w+)/.exec(className || "");

    return String(children).includes("\n") || match ? (
      <CodeBlock language={language!} {...props}>
        {children}
      </CodeBlock>
    ) : (
      <code className={clsx(className, "text-white/45")} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ node, children, ...props }) => {
    return <pre {...props}>{children}</pre>;
  },
  a: ({ node, children, ...props }) => {
    // add the target blank attribute to all links
    return (
      <a target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
} as Components;

type Props = {
  message: Message;
};

function MessagesListItem({ message }: Props) {
  const session = useSession();
  const user = session?.data?.user;

  return (
    <>
      <div className="flex flex-col gap-y-8">
        <div>
          <div className="flex items-center gap-x-2">
            {message.role === "assistant" ? (
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                <BotIcon className="text-xl" />
              </div>
            ) : message.role === "user" && user?.image ? (
              <Image
                src={user.image}
                alt={user?.name || user?.email || "user"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                U
              </div>
            )}

            <p className="font-bold">
              {message.role === "assistant"
                ? "ThinkAI"
                : user?.name || user?.email || "user"}
            </p>
          </div>

          <div className="ml-12 prose prose-pre:min-w-full prose-pre:w-0 prose-blockquote:text-slate-300 prose-strong:text-blue-300 prose-headings:text-white text-white prose-p:mt-0 prose-a:text-blue-500 prose-pre:pl-0.5 prose-pre:pr-0.5 prose-pre:pb-0.5">
            <div>
              {message.role === "assistant" ? (
                <ReactMarkdown
                  components={components}
                  remarkPlugins={[remarkGfm]}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(MessagesListItem);
