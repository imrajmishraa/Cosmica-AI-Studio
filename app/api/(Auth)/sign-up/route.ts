"use server";

import { useAuth, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";


export default async function SignUp() {
    const { signUp, errors, fetchStatus } = useSignUp();
    const { isSignedIn } = useAuth();
    const router = useRouter();

    
}