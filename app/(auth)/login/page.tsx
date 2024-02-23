import { auth } from "@/auth";
import SigninWithEmailForm from "@/components/signin-with-email-form";
import SigninWithGithub from "@/components/signin-with-github";
import SigninWithGoogle from "@/components/signin-with-google";
import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    error?: string;
  };
};

export default async function Page(props: Props) {
  const session = await auth();
  if (session) redirect("/");

  const error = props.searchParams.error;
  return (
    <main className="flex w-full h-full items-center justify-center">
      <div className="container h-fit w-fit  rounded-xl py-10 ">
        <h1 className="mb-1 text-2xl md:text-3xl text-center font-semibold">
          Create an account
        </h1>
        <p className="mb-8 text-muted-foreground text-center text-sm md:text-base">
          Enter your email below to create your account
        </p>

        {error === "OAuthAccountNotLinked" && (
          <div className="mb-5 flex justify-center text-center max-w-80 mx-auto">
            <span className="text-red-500 text-sm">
              To confirm your identity, sign in with the same account you used
              originally.
            </span>
          </div>
        )}

        <SigninWithEmailForm />

        <div className="mb-5 mt-8 flex justify-center border-t-2 border-muted-foreground w-full">
          <span className="-translate-y-2 z-10 bg-background text-muted-foreground text-xs font-semibold px-3">
            OR CONTINUE WITH
          </span>
        </div>

        <SigninWithGithub className="w-full mb-3" />
        <SigninWithGoogle className="w-full" />
      </div>
    </main>
  );
}
