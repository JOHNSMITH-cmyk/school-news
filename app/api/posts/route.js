import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function safeFileName(name) {
  const extension = path.extname(name);
  const baseName = path
    .basename(name, extension)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);

  return `${Date.now()}-${baseName || "file"}${extension}`;
}

async function saveUpload(file) {
  if (!file || file.size === 0) {
    return null;
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Tep tai len khong duoc vuot qua 10MB");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const fileName = safeFileName(file.name);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, fileName), bytes);

  return `/uploads/${fileName}`;
}

async function getPostBody(req) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("file");

    return {
      title: formData.get("title")?.toString(),
      content: formData.get("content")?.toString(),
      image: formData.get("image")?.toString(),
      category_id: formData.get("category_id")?.toString(),
      file_url: await saveUpload(file),
    };
  }

  return req.json();
}

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT
        posts.*,
        categories.name AS category_name,
        categories.slug AS category_slug
      FROM posts
      LEFT JOIN categories ON categories.id = posts.category_id
      ORDER BY posts.id DESC`
    );

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
    const body = await getPostBody(req);
    const { title, content, image, category_id, file_url } = body;

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
      "INSERT INTO posts (title, content, image, category_id, file_url) VALUES (?, ?, ?, ?, ?)",
      [title, content, image || null, category_id || null, file_url || null]
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
