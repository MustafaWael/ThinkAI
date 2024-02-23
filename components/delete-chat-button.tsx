"use client";
import { Loader2Icon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteChat } from "@/actions";
import { MouseEvent, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function DeleteChatButton({ chatId }: { chatId: string }) {
  // useTransition
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  const handleDeleteChat = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.stopPropagation();
    startTransition(async () => {
      await deleteChat(chatId);
      if (pathname.split("/")[2] === chatId) {
        router.replace("/");
      }
    });
  };

  return (
    <Button
      className="w-auto h-auto p-0 m-0 bg-transparent hover:bg-transparent text-red-400"
      title="Delete Chat"
      variant={"destructive"}
      size={"icon"}
      disabled={isPending}
      onClick={handleDeleteChat}
    >
      {isPending ? (
        <Loader2Icon size={18} className="animate-spin" />
      ) : (
        <TrashIcon size={18} />
      )}
    </Button>
  );
}
