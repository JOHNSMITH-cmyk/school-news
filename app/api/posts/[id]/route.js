import { db } from "@/lib/db";

export async function DELETE(_req, { params }) {
  try {
    const { id } = await params;

    const [result] = await db.execute("DELETE FROM posts WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return Response.json(
        {
          success: false,
          message: "Khong tim thay bai viet",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Da xoa bai viet",
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
