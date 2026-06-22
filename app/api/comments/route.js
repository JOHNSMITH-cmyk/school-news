import { cookies } from "next/headers";
import { db } from "@/lib/db";
import {
  MEMBER_COOKIE_NAME,
  verifyMemberToken,
} from "@/lib/member-auth";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const member = verifyMemberToken(cookieStore.get(MEMBER_COOKIE_NAME)?.value);

    if (!member) {
      return Response.json(
        {
          success: false,
          message: "Ban can dang nhap de binh luan",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const postId = Number(body.post_id);
    const content = body.content?.trim();

    if (!postId || !content) {
      return Response.json(
        {
          success: false,
          message: "Thieu bai viet hoac noi dung binh luan",
        },
        { status: 400 }
      );
    }

    await db.execute(
      "INSERT INTO post_comments (post_id, member_id, content) VALUES (?, ?, ?)",
      [postId, member.id, content]
    );

    return Response.json({
      success: true,
      message: "Da gui binh luan",
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
