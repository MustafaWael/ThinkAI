"use client";
import React, { memo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CheckIcon, CopyIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  language: string;
  children: any;
};

const CodeBlock = ({ children, language }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const setCopied = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 px-3">
        <div className="text-lg">{language}</div>
        <CopyToClipboard text={children}>
          <button onClick={() => setCopied()} className="flex items-center" disabled={isCopied}>
            <AnimatePresence initial={false} mode="wait">
              {isCopied ? (
                <motion.span
                  key={'copied'}
                  title="Copied!"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <CheckIcon />
                </motion.span>
              ) : (
                <motion.span
                  key={'copy-to-clipboard'}
                  title="Copy to Clipboard"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <CopyIcon />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </CopyToClipboard>
      </div>

      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          borderRadius: "0.5rem",
          fontSize: "1rem",
        }}
        PreTag={({ children, style, ...props }) => (
          <pre {...props} className="p-0 m-0">
            <ScrollArea
              type="scroll"
              className="overflow-auto bg-slate-950 rounded-md"
            >
              {children}
              <ScrollBar
                orientation="horizontal"
                className="bg-slate-950 mt-4 m-0.5 scrollarea__bar"
              />
            </ScrollArea>
          </pre>
        )}
        CodeTag={({ children, ...props }) => (
          <code
            {...props}
            style={{ fontSize: "16px" }}
            className="inline-block p-3 pb-4"
          >
            {children}
          </code>
        )}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export default memo(CodeBlock);
