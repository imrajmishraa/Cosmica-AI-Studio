"use client";

import React, { useState } from "react";
import Link from "next/link";
import {redirect, useRouter} from "next/navigation";

import { cn } from "@/app/lib/utils";
import { useSignUp } from "@clerk/react";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { url } from "inspector";



interface LabelInputContainerProps {
  children: React.ReactNode;
  className?: string;
}

const LabelInputContainer = ({
  children,
  className,
}: LabelInputContainerProps) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const { isLoaded } = useUser();

  const router = useRouter();



  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);



  if (!isLoaded) {
    return null; // {/* set loader here*/}
  }

  async function handleSubmit (formData: FormData) {
    const emailAddress = formData.get("email") as string;
    const password = formData.get("password") as string;
    
     const { error } = await signUp.password({
       emailAddress,
       password: password,
     });
  
      if (error) {
        console.error(JSON.stringify(error, null, 2));
        return;
      }

      if(!error) await signUp.verifications.sendEmailCode();
      redirect("/verify-email");
  };

  


  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-950">
      <div className="rounded-none border border-solid border-white/30 bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-6">
        <h2 className="text-xl justify-center text-center font-bold text-neutral-800 dark:text-neutral-200">
          SignUp to Cosmica
        </h2>

        <form className="mt-8 mb-4 space-y-4" action={handleSubmit}>
          {/* Email */}
          <LabelInputContainer>
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="you@example.com"
              required
              className="flex h-10 w-full rounded-md border border-neutral-200 bg-gray-50 px-3 py-2 text-sm text-neutral-800 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-zinc-800 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus-visible:ring-neutral-600"
            />
          </LabelInputContainer>

          {/* Password */}
          <LabelInputContainer>
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="flex h-10 w-full rounded-md border border-neutral-200 bg-gray-50 px-3 py-2 text-sm text-neutral-800 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-zinc-800 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus-visible:ring-neutral-600"
            />
          </LabelInputContainer>

          <button
            className="group relative mt-8 block h-10 w-full rounded-md bg-linear-to-br >
          from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition-all hover:opacity-90 dark:bg-zinc-800 dark:from-blue-600 dark:to-blue-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Login &rarr;
          </button>
        </form>

        <p className="mt-6 max-w-sm text-sm text-center text-neutral-600 dark:text-neutral-300">
          <br /> If you don&apos;t have an account,{" "}
          <Link
            href="/components/login"
            className="text-orange-500 hover:underline"
          >
            SignIn
          </Link>{" "}
          with Cosmica
        </p>
        <div id="clerk-captcha" />
      </div>
    </div>
  );
}
