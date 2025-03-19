"use server";

import db from "@/db/db";
import { hashPassword, signToken, verifyPassword } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function handleLogin(_: unknown, data: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(data.entries()));

  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const user = await db.user.findUnique({
    where: { email: result.data.email },
  });
  if (!user) {
    return { email: ["Invalid email or password"] };
  }

  if (!(await verifyPassword(result.data.password, user.password))) {
    return { email: ["Invalid email or password"] };
  }

  const token = await signToken({
    id: user.id,
    email: user.email,
    freeGenerates: user.freeGenerates,
    paidGenerates: user.paidGenerates,
    isAdmin: user.isAdmin,
  });

  (await cookies()).set({
    name: process.env.JWT_KEY!,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  redirect("/");
}

export async function handleRegister(_: unknown, data: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(data.entries()));

  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const user = await db.user.findUnique({
    where: { email: result.data.email },
  });
  if (user) {
    return { email: ["User already exists"] };
  }

  const hashedPassword = await hashPassword(result.data.password);
  const newUser = await db.user.create({
    data: {
      email: result.data.email,
      password: hashedPassword,
    },
  });

  const token = await signToken({
    id: newUser.id,
    email: newUser.email,
    freeGenerates: newUser.freeGenerates,
    paidGenerates: newUser.paidGenerates,
    isAdmin: newUser.isAdmin,
  });

  (await cookies()).set({
    name: process.env.JWT_KEY!,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  redirect("/");
}
