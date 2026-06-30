import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mauve-200 dark:bg-neutral-950">
      {" "}
      <SignIn />;
    </div>
  ); 
}
