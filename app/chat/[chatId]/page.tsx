import ChatWindow from "@/components/chat-window";
import { getChatMessages } from "@/actions";
import { generateChatPageMetadata, isNewChat } from "@/lib/utils";

export const runtime = "edge";

type Props = {
  params: { chatId: string | "new-chat" };
};

export async function generateMetadata({ params }: Props) {
  return generateChatPageMetadata({ params });
}

export default async function Page({ params }: Props) {
  const chatId = isNewChat(params.chatId) ? null : params.chatId;
  const messagesList = chatId ? await getChatMessages(chatId) : [];

  return (
    <main className="w-full flex bg-slate-900 rounded-xl flex-shrink-0 md:flex-shrink will-change-[width,scroll]">
      <ChatWindow chatId={chatId} initialMessages={messagesList} />
    </main>
  );
}
