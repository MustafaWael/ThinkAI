"use client";
import { Button } from "@/components/ui/button";
import { asideAtom } from "@/atoms";
import { useAtom } from "jotai";
import { MenuIcon } from "lucide-react";

type Props = {} & React.ComponentProps<typeof Button>;

export default function OpenSidebarButton(props: Props) {
  const [isOpen, setIsOpen] = useAtom(asideAtom);
  return (
    <Button onClick={() => setIsOpen(!isOpen)} size={'icon'} {...props}>
      <MenuIcon size={24} />
    </Button>
  );
}
