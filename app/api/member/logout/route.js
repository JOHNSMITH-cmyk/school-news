import { cookies } from "next/headers";
import { MEMBER_COOKIE_NAME } from "@/lib/member-auth";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(MEMBER_COOKIE_NAME);

  return Response.json({
    success: true,
  });
}
