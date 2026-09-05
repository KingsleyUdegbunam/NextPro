"use client";

import { useConvexAuth } from "convex/react";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function NavAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  return isLoading ? null : isAuthenticated ? (
    <Button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.success("Logged out successfully");
              router.replace("/");
            },
            onError: (error) => {
              toast.error(error.error.message);
            },
          },
        })
      }
    >
      Log out
    </Button>
  ) : (
    <>
      <Link className={buttonVariants()} href="/auth/sign-up">
        Sign up
      </Link>
      <Link
        className={buttonVariants({ variant: "outline" })}
        href="/auth/login"
      >
        Login
      </Link>
    </>
  );
}
