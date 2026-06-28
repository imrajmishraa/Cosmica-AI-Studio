import { useClerk, useSignIn, useUser } from "@clerk/nextjs";


export default function SignIn() {
  const {  signIn,  } = useSignIn();
  const { setActive } = useClerk();
  const { isLoaded } = useUser();


  return <SignIn />;
}
