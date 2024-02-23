import { FaGoogle } from "react-icons/fa";
import SubmitButton from "@/components/submit-button";
import { signInWithGoogle } from "@/actions";

type Props = Omit<React.ComponentProps<typeof SubmitButton>, "children">;

export default function SigninWithGoogle(props: Props) {
  return (
    <form action={signInWithGoogle}>
      <SubmitButton variant={"outline"} {...props}>
        <FaGoogle className="text-2xl mr-4" /> Sign in with Google
      </SubmitButton>
    </form>
  );
}
