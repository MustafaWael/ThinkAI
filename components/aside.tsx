"use client";
import { asideAtom } from "@/atoms";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";

type Props = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const variants = {
  open: { x: 0, width: 250, marginRight: "1rem" },
  closed: { x: "-10rem", width: 0, marginRight: 0 },
};

const transitionConfig = {
  type: "spring",
  stiffness: 400,
  damping: 40,
};

const Aside = ({ children, ...props }: Props) => {
  const isOpen = useAtomValue(asideAtom);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className={cn(
            "bg-slate-900 rounded-xl flex flex-col flex-shrink-0 overflow-hidden relative will-change-[width,scroll,transform,margin]",
            props.className
          )}
          variants={variants}
          initial={"closed"}
          animate={isOpen ? "open" : "closed"}
          exit={"closed"}
          transition={transitionConfig}
        >
          <div className="h-full flex flex-col py-2 px-1">{children}</div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export function AsideFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 bg-slate-900 w-full h-fit p-3.5 pb-2">
      {children}
    </div>
  );
}

export function AsideHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-0  bg-slate-900 w-full h-fit p-3.5 pt-2">
      {children}
    </div>
  );
}

export default Aside;
