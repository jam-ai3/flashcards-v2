"use server";

import { UNAUTH_REDIRECT_PATH } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  (await cookies()).delete(process.env.JWT_KEY!);
  redirect(UNAUTH_REDIRECT_PATH);
}
