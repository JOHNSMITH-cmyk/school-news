import Link from "next/link";
import { db } from "@/lib/db";

async function getPosts() {
  try {
    const [rows] = await db.query(
      "SELECT id, title, content, image FROM posts ORDER BY id DESC"
    );

    return {
      posts: rows,
      error: null,
    };
  } catch (error) {
    console.error("Khong the lay danh sach bai viet:", error);

    return {
      posts: [],
      error: error.message,
    };
  }
}

export default async function Home() {
  const { posts, error } = await getPosts();
  const [featuredPost, ...otherPosts] = posts;

  return (
    <main className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,#ff7ad9_0,#8b5cf6_28%,#22d3ee_55%,#fef3c7_100%)] px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="rounded-lg border border-white/40 bg-white/25 p-6 shadow-2xl shadow-fuchsia-900/10 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
            News vibes
          </p>
          <h1 className="mt-2 text-4xl font-black text-white drop-shadow-sm sm:text-5xl">
            Danh sach bai viet
          </h1>
          <p className="mt-3 max-w-2xl text-base font-medium text-white/85">
            Cap nhat cac bai viet moi nhat voi giao dien glass, gradient va
            hieu ung hover hien dai.
          </p>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200/70 bg-white/45 p-6 text-zinc-900 shadow-xl shadow-red-950/10 backdrop-blur-xl">
            <h2 className="text-xl font-black text-red-600">
              Khong ket noi duoc MySQL
            </h2>
            <p className="mt-2 font-medium">
              Hay kiem tra XAMPP/MySQL dang Start, database news_db ton tai, va
              sau do refresh lai trang.
            </p>
            <p className="mt-3 rounded-md bg-white/60 px-3 py-2 text-sm text-zinc-700">
              Loi: {error}
            </p>
          </div>
        ) : featuredPost ? (
          <Link
            className="group block rounded-lg border border-white/50 bg-white/30 p-6 shadow-2xl shadow-violet-900/20 backdrop-blur-xl transition duration-300 hover:scale-[1.02] hover:bg-white/40"
            href={`/posts/${featuredPost.id}`}
          >
            <article className="grid gap-5 md:grid-cols-[1.2fr_0.8fr] md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-fuchsia-950/70">
                  Featured
                </p>
                <h2 className="mt-3 text-3xl font-black text-zinc-950 sm:text-4xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 line-clamp-3 text-base font-medium leading-7 text-zinc-800">
                  {featuredPost.content}
                </p>
              </div>
              <div className="rounded-lg border border-white/50 bg-gradient-to-br from-white/55 to-white/20 p-5 text-right">
                <span className="text-sm font-semibold text-zinc-700">
                  Doc bai noi bat
                </span>
                <div className="mt-4 text-5xl font-black text-zinc-950 transition duration-300 group-hover:translate-x-1">
                  #{featuredPost.id}
                </div>
              </div>
            </article>
          </Link>
        ) : (
          <div className="rounded-lg border border-white/40 bg-white/30 p-6 text-zinc-800 backdrop-blur-xl">
            Chua co bai viet nao.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {otherPosts.map((post) => (
            <Link
              key={post.id}
              className="group block rounded-lg border border-white/45 bg-white/25 p-5 shadow-xl shadow-cyan-950/10 backdrop-blur-xl transition duration-300 hover:scale-[1.03] hover:bg-white/40"
              href={`/posts/${post.id}`}
            >
              <article>
                <div className="mb-4 inline-flex rounded-full bg-white/45 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-950">
                  Bai viet
                </div>
                <h2 className="text-xl font-black text-zinc-950 transition duration-300 group-hover:text-fuchsia-700">
                  {post.title}
                </h2>
                <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-zinc-700">
                  {post.content}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
