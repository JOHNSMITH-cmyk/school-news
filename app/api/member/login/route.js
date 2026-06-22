import { cookies } from "next/headers";
import { db } from "@/lib/db";
import {
  MEMBER_COOKIE_NAME,
  createMemberToken,
  getSafeRedirect,
  verifyPassword,
} from "@/lib/member-auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const redirectTo = getSafeRedirect(body.redirectTo);

    if (!email || !password) {
      return Response.json(
        {
          success: false,
          message: "Vui long nhap email va mat khau",
        },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      "SELECT id, username, email, password FROM members WHERE email = ? LIMIT 1",
      [email]
    );
    const member = rows[0];

    if (!member || !verifyPassword(password, member.password)) {
      return Response.json(
        {
          success: false,
          message: "Sai email hoac mat khau",
        },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(
      MEMBER_COOKIE_NAME,
      createMemberToken({
        id: member.id,
        username: member.username,
      }),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return Response.json({
      success: true,
      redirectTo,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
