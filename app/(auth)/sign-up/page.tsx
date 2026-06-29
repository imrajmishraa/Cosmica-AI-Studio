"use client";

import { useAuth, useSignUp, useUser } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
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


export default function Page() {
  const router = useRouter();

  const { isLoaded, isSignedIn } = useAuth();
  const { signUp, errors, fetchStatus } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [loading, IsLoading] = useState(false);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if(isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

  if(!isLoaded || !isMounted) {
    return (
    <div 
      className="flex min-h-screen items-center, justify-center"
    >
      <div>loading...</div>
    </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded)
      return;

    IsLoading(true);
    setError(null);

    try {
      await signUp.password({
        emailAddress: email,
        password: password,
      });

      // Send the verification code
      await signUp.verifications.sendEmailCode();
        
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || "An error occured during sign up");
    } finally {
      IsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!isLoaded) {
      return
    }

    IsLoading(true);
    setIsMounted(true);

    try {
      await signUp.verifications.verifyEmailCode({
        code,
      });

      if (signUp.status === 'complete') {
      await signUp.finalize({
        // Redirect the user to the home page after signing up
        navigate: ({ session, decorateUrl }) => {
          // Handle session tasks
          // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
          if (session?.currentTask) {
            console.log(session?.currentTask)
            return
          }

          const url = decorateUrl('/')
          if (url.startsWith('http')) {
            window.location.href = url
          } else {
            router.push(url)
          }
        },
      })
    }       
  } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || "An error occured during sign up");
    } finally {
      IsLoading(false);
    }

  return
  (<></>)
}
}