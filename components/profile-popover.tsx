import { auth } from "@/auth";
import { Session } from "next-auth";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SignOut from "@/components/signout-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function ProfileButton({
  className,
  hideNameOnMobile = false,
}: {
  className?: string;
  hideNameOnMobile?: boolean;
}) {
  const session = (await auth()) as Session;

  return (
    <PopoverTrigger
      className={buttonVariants({
        variant: "secondary",
        class: cn("flex items-center w-[214px] p-4", className),
      })}
    >
      <div className="flex gap-x-3 items-center justify-center w-full">
        {session.user?.image ? (
          <Image
            src={session.user.image}
            width={32}
            height={32}
            alt="User avatar"
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-700 flex justify-center items-center">
            <p className="text-white text-xl">
              {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
            </p>
          </div>
        )}

        <span
          className={cn(
            "text-sm font-medium overflow-hidden overflow-ellipsis whitespace-nowrap",
            hideNameOnMobile && "hidden md:block"
          )}
        >
          {session.user?.name ?? session.user?.email}
        </span>
      </div>
    </PopoverTrigger>
  );
}

export function ProfilePopover({
  className,
  hideNameOnMobile = false,
}: {
  className?: string;
  hideNameOnMobile?: boolean;
}) {
  return (
    <Popover>
      <ProfileButton
        className={className}
        hideNameOnMobile={hideNameOnMobile}
      />
      <PopoverContent className="w-52 rounded-2xl my-2">
        <ProfilePopoverContent />
      </PopoverContent>
    </Popover>
  );
}

export function ProfilePopoverContent() {
  return <SignOut className="w-full" />;
}
