import { signInWithEmail } from "@/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SigninWithEmailForm() {
  return (
    <form action={signInWithEmail} className="flex flex-col gap-y-3">
      <Label htmlFor="email">Email</Label>
      <Input
        type="email"
        name="email"
        id="email"
        placeholder="name@example.com"
      />
      <Button>Sign in with Email</Button>
    </form>
  );
}
