"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

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

export default function SignInPage() {
  const { errors, signIn, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Show loading state while Clerk initializes
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. Initiate the sign-in process
      // Notice we use "identifier" here instead of "emailAddress"
      await signIn.create({
        identifier: emailAddress,
        password,
      });

      // 2. Check if the sign-in is complete
      if (signIn.status === "complete") {
        // Set the active session and redirect to the home page
        await setActive({ session: signIn.createdSessionId });
        router.push("/");
      } else {
        // This triggers if the user has Two-Factor Authentication (MFA) enabled.
        // You would handle MFA verification UI here.
        console.log("Requires further verification:", );
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      // Extract and display the specific Clerk error message
      setError(err.errors?.[0]?.message || "An error occurred during sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-6 p-8 min-h-screen">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-gray-500">
          Enter your credentials to sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <LabelInputContainer>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            placeholder="name@example.com"
            required
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </LabelInputContainer>

        {error && (
          <div className="text-sm text-red-500 text-center font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 flex w-full items-center justify-center rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
