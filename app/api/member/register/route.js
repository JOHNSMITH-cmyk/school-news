import { cookies } from "next/headers";
import { db } from "@/lib/db";
import {
  MEMBER_COOKIE_NAME,
  createMemberToken,
  getSafeRedirect,
  hashPassword,
} from "@/lib/member-auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const username = body.username?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const redirectTo = getSafeRedirect(body.redirectTo);

    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Vui long nhap day du ten, email va mat khau",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        {
          success: false,
          message: "Mat khau toi thieu 6 ky tu",
        },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);
    const [result] = await db.execute(
      "INSERT INTO members (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    const member = {
      id: result.insertId,
      username,
    };

    const cookieStore = await cookies();
    cookieStore.set(MEMBER_COOKIE_NAME, createMemberToken(member), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({
      success: true,
      redirectTo,
    });
  } catch (error) {
    const duplicate = error.code === "ER_DUP_ENTRY";

    return Response.json(
      {
        success: false,
        message: duplicate ? "Ten hoac email da duoc su dung" : undefined,
        error: duplicate ? undefined : error.message,
      },
      { status: duplicate ? 409 : 500 }
    );
  }
}
