"use client";

import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { ArrowBigDownIcon, InfoIcon, PauseCircleIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";


type Props = {
  isLoading: boolean;
  scrollToBottom?: () => void;
  scrollToTop?: () => void;
  pause: () => void;
  atBottom: (callback: (atBottom: boolean) => void) => void;
  atTop: (callback: (atTop: boolean) => void) => void;
  onScroll: (callback: (scrollPosition: number) => void) => void;
};

const ChatActions = ({
  isLoading,
  pause,
  scrollToBottom,
  atBottom,
  atTop,
  onScroll,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showPause, setShowPause] = useState(false);

  useLayoutEffect(() => {
    const element = ref.current;
    let observer: ResizeObserver;
    if (element) {
      // observe the element
      observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { inlineSize } = entry.borderBoxSize[0];
          controls.start({
            width: inlineSize,
            transition: {
              duration: 0.3,
              delay: .1
            },
          });
        }
      });

      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [controls]);

  useEffect(() => {
    onScroll(() => {
      atBottom((atBottom) => {
        setIsAtBottom(atBottom);
      });
    });
  }, [atBottom, atTop, onScroll]);

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setShowPause(true);
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    } else {
      setShowPause(false);
    }
  }, [isLoading]);

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        className="absolute -top-[4.5rem] left-1/2 -translate-x-1/2 w-fit"
        initial={{ opacity: 1 }}
        animate={{ opacity: isAtBottom ? 0.6 : 1 }}
      >
        <motion.div
          className="bg-slate-800/40 rounded-lg overflow-hidden will-change-[contents,transform,width] backdrop-blur-sm backdrop:contrast-50 drop-shadow-md border border-slate-900/50"
          animate={controls}
        >
          <div className="flex gap-x-2 w-fit p-2" ref={ref}>
            <Popover>
              <PopoverTrigger
                className={cn(
                  buttonVariants({ size: "icon", variant: "secondary" }),
                  "p-1 w-auto h-auto rounded-md"
                )}
              >
                <InfoIcon size={24} />
              </PopoverTrigger>
              <PopoverContent
                sideOffset={15}
                className="p-2 bg-slate-800 rounded-lg border-0"
                side="top"
              >
                <p className="text-sm text-gray-300">
                  The maximum token limit is 4096. If you reach the limit, you
                  can create a new chat to continue using the app.
                </p>
              </PopoverContent>
            </Popover>

            <AnimatePresence initial={false} mode="wait">
              {
                // show scroll to top
                !isAtBottom ? (
                  <motion.button
                    key={"scroll-to-bottom"}
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1, transition: { delay: 0.1 } }}
                    exit={{ scale: 0, opacity: 0 }}
                    layout="position"
                    onClick={scrollToBottom}
                    className={cn(
                      buttonVariants({ size: "icon", variant: "secondary" }),
                      "p-1 w-auto h-auto rounded-md"
                    )}
                  >
                    <ArrowBigDownIcon size={24} />
                  </motion.button>
                ) : null
              }
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {showPause ? (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
                  exit={{ opacity: 0, scale: 0 }}
                  layout="position"
                  className={cn(
                    buttonVariants({ size: "icon", variant: "secondary" }),
                    "p-1 w-auto h-auto rounded-md"
                  )}
                  onClick={pause}
                >
                  <PauseCircleIcon size={24} />
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(ChatActions);
