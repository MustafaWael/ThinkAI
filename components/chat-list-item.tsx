"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { asideAtom } from "@/atoms";
import DeleteChatButton from "@/components/delete-chat-button";

type ChatListItemProps = {
  chat: Chat;
};

export function ChatListItem({ chat }: ChatListItemProps) {
  const pathname = usePathname();
  const isActive = pathname.split("/")[2] === chat.id;
  const setIsOpen = useSetAtom(asideAtom);
  const router = useRouter();
  return (
    <li>
      <Button
        variant={isActive ? "default" : "secondary"}
        className="w-[214px] overflow-hidden overflow-ellipsis whitespace-nowrap flex items-center justify-between gap-x-2"
        onClick={() => {
          setIsOpen(false);
          router.push(`/chat/${chat.id}`);
        }}
      >
        <span className="min-w-0 truncate">{chat.name || "Unnamed Chat"}</span>
        <DeleteChatButton chatId={chat.id} />
      </Button>
    </li>
  );
}
