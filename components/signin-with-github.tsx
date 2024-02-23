import { FaGithub } from "react-icons/fa";
import SubmitButton from "@/components/submit-button";
import { signInWithGithub } from "@/actions";

type Props = Omit<React.ComponentProps<typeof SubmitButton>, "children">;

export default function SigninWithGithub(props: Props) {
  return (
    <form action={signInWithGithub}>
      <SubmitButton variant={"outline"} {...props}>
        <FaGithub className="text-2xl mr-4" /> Sign in with Github
      </SubmitButton>
    </form>
  );
}
