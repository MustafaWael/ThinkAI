import { getUserChatsList } from "@/actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ChatListItem } from "@/components/chat-list-item";

export default async function ChatList() {
  const session = await auth();
  if (!session || !session.user) {
    return redirect("/login");
  }
  const chatList = await getUserChatsList(session.user.id);

  return (
    <ul className="flex flex-col gap-y-4 h-full">
      {chatList.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}
    </ul>
  );
}
