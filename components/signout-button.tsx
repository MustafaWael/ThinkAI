import SubmitButton from "@/components/submit-button";
import { signout } from "@/actions";
import { LogOutIcon } from "lucide-react";

type Props = Omit<React.ComponentProps<typeof SubmitButton>, "children">;

export default function SignOut(props: Props) {
  return (
    <form action={signout}>
      <SubmitButton variant={"destructive"} {...props}>
        <LogOutIcon className="text-2xl mr-4" /> Sign out
      </SubmitButton>
    </form>
  );
}
