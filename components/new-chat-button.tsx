"use client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EditIcon } from "lucide-react";
import { useSetAtom } from "jotai";
import { asideAtom } from "@/atoms";

export default function NewChatButton() {
  const setAsideOpen = useSetAtom(asideAtom);

  return (
    <Link
      href={"/"}
      className={cn(buttonVariants({ size: "lg", class: "w-[214px]" }))}
      onClick={() => {
        setAsideOpen(false);
      }}
    >
      New Chat <EditIcon className="ml-2" size={21} />
    </Link>
  );
}
