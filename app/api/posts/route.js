import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM posts ORDER BY id DESC");

    return Response.json({
      success: true,
      data: rows,
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

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, content, image } = body;

    if (!title || !content) {
      return Response.json(
        {
          success: false,
          message: "Thieu title hoac content",
        },
        { status: 400 }
      );
    }

    await db.execute(
      "INSERT INTO posts (title, content, image) VALUES (?, ?, ?)",
      [title, content, image ?? null]
    );

    return Response.json({
      success: true,
      message: "Them bai viet thanh cong",
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

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        {
          success: false,
          message: "Thieu id bai viet",
        },
        { status: 400 }
      );
    }

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
