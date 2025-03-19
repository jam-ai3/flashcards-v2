import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";
import db from "./db/db";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(process.env.JWT_KEY!);
  const decoded = await verifyToken(token?.value ?? "");
  if (!decoded) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  const isAuthenticated = await userExists(decoded?.id);
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  return NextResponse.next();
}

async function userExists(userId: string | undefined) {
  const user = await db.user.findUnique({ where: { id: userId } });
  return !!user;
}

export const config = {
  matcher: ["/", "/flashcards/:path*", "/plan", "/groups"],
};
