import { verifyToken } from "@/lib/auth";
import { headers } from "next/headers";
export default async function useSession() {
  const head = await headers();
  const jwt = head
    .get("cookie")
    ?.split("; ")
    .filter((v) => v.startsWith(process.env.JWT_KEY!));
  if (jwt === undefined || jwt.length === 0) {
    return null;
  }
  const token = jwt[0].split("=")[1];
  if (token) {
    const decoded = await verifyToken(token);
    return decoded;
  }
  return null;
}
