import Aside, { AsideFooter, AsideHeader } from "@/components/aside";
import { ProfilePopover } from "@/components/profile-popover";
import ChatList from "@/components/chat-list";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import NewChatButton from "@/components/new-chat-button";

export default function Sidebar() {
  return (
    <Aside>
      <AsideHeader>
        <div className="flex flex-col items-center justify-center min-w-[max-content]">
          <NewChatButton />
        </div>
      </AsideHeader>
      <ScrollArea
        type="scroll"
        className="flex-grow h-full overflow-y-auto min-h-0"
      >
        <div className="w-full p-3.5">
          <ChatList />
        </div>

        <ScrollBar className="z-10 scrollarea__bar" />
      </ScrollArea>
      <AsideFooter>
        <ProfilePopover />
      </AsideFooter>
    </Aside>
  );
}
