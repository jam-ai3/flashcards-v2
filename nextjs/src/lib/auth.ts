import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_REDIRECT_PATH } from "./constants";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET!);

type User = {
  id: string;
  email: string;
  freeGenerates: number;
  paidGenerates: number;
  isAdmin: boolean;
};

export async function signToken(payload: User) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });
    return payload as User;
  } catch (error) {
    console.error("JWT Error:", error);
    return null;
  }
}

export async function hashPassword(password: string) {
  const arrayBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(password)
  );
  return Buffer.from(arrayBuffer).toString("hex");
}

export async function verifyPassword(password: string, hash: string) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
