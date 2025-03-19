"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { handleLogin } from "../_actions/auth";
import Link from "next/link";

export default function LoginPage() {
  const [error, action] = useActionState(handleLogin, {});

  return (
    <main className="h-screen grid place-items-center">
      <h1 className="absolute top-6 left-6 text-2xl font-semibold">
        Flashcard Generator
      </h1>
      <form
        action={action}
        className="bg-secondary rounded-md p-6 flex flex-col gap-4 w-1/3 aspect-video"
      >
        <h1 className="text-2xl font-bold mx-auto">Login</h1>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="text" name="email" required placeholder="jdoe@gmail" />
          {error?.email && (
            <p className="text-destructive text-sm">{error.email}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            required
            placeholder="Password"
          />
          {error?.password && (
            <p className="text-destructive text-sm">{error.password}</p>
          )}
        </div>
        <Button type="submit">Login</Button>
        <p>
          <span>
            Don&apos;t have an account?{" "}
            <Link href="/auth/register">Register</Link>
          </span>
        </p>
      </form>
    </main>
  );
}
