import { auth } from "@/auth";
import { ProfilePopover } from "@/components/profile-popover";
import OpenSidebarButton from "@/components/open-sidebar-button";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="p-4 flex justify-between items-center">
      <div className="flex items-center">
        <OpenSidebarButton className="mr-4" />
        <h1 className="text-2xl font-semibold">ThinkAI</h1>
      </div>
      <div className="w-fit">
        {session && (
          <ProfilePopover className="w-full" hideNameOnMobile={true} />
        )}
      </div>
    </nav>
  );
}
