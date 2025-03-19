"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { useActionState } from "react";
import { handleRegister } from "../_actions/auth";

export default function RegisterPage() {
  const [error, action] = useActionState(handleRegister, {});

  return (
    <main className="h-screen grid place-items-center">
      <h1 className="absolute top-6 left-6 text-2xl font-semibold">
        Flashcard Generator
      </h1>
      <form
        action={action}
        className="bg-secondary rounded-md p-6 flex flex-col gap-4 w-1/3 aspect-video"
      >
        <h1 className="text-2xl font-bold mx-auto">Register</h1>
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
        <Button type="submit">Register</Button>
        <p>
          <span>
            Already have an account? <Link href="/auth/login">Login</Link>
          </span>
        </p>
      </form>
    </main>
  );
}
