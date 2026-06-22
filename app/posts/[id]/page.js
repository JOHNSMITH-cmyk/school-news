import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getMemberFromCookieStore } from "@/lib/member-auth";
import CommentForm from "./CommentForm";

export const dynamic = "force-dynamic";

export default async function PostDetail({ params }) {
  const { id } = await params;
  let rows = [];
  let comments = [];
  let commentsError = null;

  try {
    [rows] = await db.query(
      `SELECT
        posts.id,
        posts.title,
        posts.content,
        posts.image,
        posts.file_url,
        categories.name AS category_name,
        categories.slug AS category_slug
      FROM posts
      LEFT JOIN categories ON categories.id = posts.category_id
      WHERE posts.id = ?
      LIMIT 1`,
      [id]
    );

    [comments] = await db.query(
      `SELECT
        post_comments.id,
        post_comments.content,
        post_comments.created_at,
        members.username
      FROM post_comments
      INNER JOIN members ON members.id = post_comments.member_id
      WHERE post_comments.post_id = ?
      ORDER BY post_comments.id DESC`,
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

  const cookieStore = await cookies();
  const member = getMemberFromCookieStore(cookieStore);
  const loginHref = `/member/login?redirect=${encodeURIComponent(
    `/posts/${post.id}#comments`
  )}`;
  const registerHref = `/member/register?redirect=${encodeURIComponent(
    `/posts/${post.id}#comments`
  )}`;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <Link
        className="text-sm font-medium text-zinc-600 hover:text-zinc-950"
        href="/"
      >
        Quay lai danh sach
      </Link>

      <article className="rounded-lg border border-zinc-200 bg-white p-6">
        {post.category_name ? (
          <Link
            className="mb-4 inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-700 transition hover:bg-violet-100"
            href={`/categories/${post.category_slug}`}
          >
            {post.category_name}
          </Link>
        ) : null}
        <h1 className="text-3xl font-semibold text-zinc-950">{post.title}</h1>
        <p className="mt-4 whitespace-pre-line text-zinc-700">
          {post.content}
        </p>
        {post.file_url ? (
          <a
            className="mt-6 inline-flex rounded-md bg-zinc-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-zinc-700"
            download
            href={post.file_url}
          >
            Tai tep dinh kem
          </a>
        ) : null}
      </article>

      <section
        className="grid gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-6"
        id="comments"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-zinc-950">Binh luan</h2>
            <p className="mt-1 text-sm text-zinc-600">
              {comments.length} binh luan cho bai viet nay.
            </p>
          </div>

          {!member ? (
            <Link
              className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-zinc-700"
              href={loginHref}
            >
              Binh luan
            </Link>
          ) : null}
        </div>

        {member ? (
          <CommentForm postId={post.id} username={member.username} />
        ) : (
          <div className="rounded-lg border border-zinc-200 bg-white p-5 text-zinc-700">
            <p className="font-medium">
              Ban can dang nhap hoac dang ky de gui binh luan.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-zinc-700"
                href={loginHref}
              >
                Dang nhap
              </Link>
              <Link
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-bold text-zinc-800 transition hover:bg-zinc-100"
                href={registerHref}
              >
                Dang ky
              </Link>
            </div>
          </div>
        )}

        {commentsError ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Loi tai binh luan: {commentsError}
          </p>
        ) : null}

        <div className="grid gap-3">
          {comments.map((comment) => (
            <article
              className="rounded-lg border border-zinc-200 bg-white p-4"
              key={comment.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-black text-zinc-950">
                  {comment.username}
                </h3>
                <time className="text-xs font-medium text-zinc-500">
                  {new Date(comment.created_at).toLocaleString("vi-VN")}
                </time>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-700">
                {comment.content}
              </p>
            </article>
          ))}

          {comments.length === 0 ? (
            <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-600">
              Chua co binh luan nao.
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
