"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

type Props = React.ComponentProps<typeof Button>;

export default function SubmitButton({ children, ...props }: Props) {
  const { pending } = useFormStatus();
  return (
    <Button {...props}>
      {pending && <Loader2Icon className="animate-spin mr-2" />}
      {children}
    </Button>
  );
}
