import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export default async function PostDetail({ params }) {
  const { id } = await params;
  let rows = [];

  try {
    [rows] = await db.query(
      "SELECT id, title, content, image FROM posts WHERE id = ? LIMIT 1",
      [id]
    );
  } catch (error) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
        <Link
          className="text-sm font-medium text-zinc-600 hover:text-zinc-950"
          href="/"
        >
          Quay lai danh sach
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          <h1 className="text-2xl font-semibold">Khong ket noi duoc MySQL</h1>
          <p className="mt-2">Hay kiem tra XAMPP/MySQL roi thu lai.</p>
          <p className="mt-3 text-sm">Loi: {error.message}</p>
        </div>
      </main>
    );
  }

  const post = rows[0];

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <Link
        className="text-sm font-medium text-zinc-600 hover:text-zinc-950"
        href="/"
      >
        Quay lai danh sach
      </Link>

      <article className="rounded-lg border border-zinc-200 bg-white p-6">
        <h1 className="text-3xl font-semibold text-zinc-950">{post.title}</h1>
        <p className="mt-4 whitespace-pre-line text-zinc-700">{post.content}</p>
      </article>
    </main>
  );
}
