import { cookies } from "next/headers";
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_VALUE,
  isValidAdminLogin,
} from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!isValidAdminLogin(username, password)) {
      return Response.json(
        {
          success: false,
          message: "Sai ten dang nhap hoac mat khau",
        },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();

    cookieStore.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return Response.json({
      success: true,
      message: "Dang nhap thanh cong",
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
