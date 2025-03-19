import { NextRequest, NextResponse } from "next/server";
import { signToken, verifyToken } from "./lib/auth";
import db from "./db/db";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(process.env.JWT_KEY!);
  const decoded = await verifyToken(token?.value ?? "");
  if (!decoded) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  const user = await userExists(decoded?.id);
  if (user === null) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  const newToken = await signToken({
    id: user.id,
    email: user.email,
    freeGenerates: user.freeGenerates,
    paidGenerates: user.paidGenerates,
    isAdmin: user.isAdmin,
  });
  req.cookies.set(process.env.JWT_KEY!, newToken);
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!user.isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  return NextResponse.next();
}

async function userExists(userId: string | undefined) {
  const user = await db.user.findUnique({ where: { id: userId } });
  return user;
}

export const config = {
  matcher: ["/", "/flashcards/:path*", "/plan", "/groups", "/admin/:path*"],
};
