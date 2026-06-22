import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getCategoryPosts(slug) {
  try {
    const [categoryRows] = await db.query(
      "SELECT id, name, slug FROM categories WHERE slug = ? LIMIT 1",
      [slug]
    );

    const category = categoryRows[0];

    if (!category) {
      return {
        category: null,
        posts: [],
        error: null,
      };
    }

    const [posts] = await db.query(
      `SELECT id, title, content, image, file_url
      FROM posts
      WHERE category_id = ?
      ORDER BY id DESC`,
      [category.id]
    );

    return {
      category,
      posts,
      error: null,
    };
  } catch (error) {
    return {
      category: null,
      posts: [],
      error: error.message,
    };
  }
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const { category, posts, error } = await getCategoryPosts(slug);

  if (!error && !category) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,#ff7ad9_0,#8b5cf6_28%,#22d3ee_55%,#fef3c7_100%)] px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <Link
          className="w-fit rounded-md border border-white/45 bg-white/25 px-3 py-2 text-sm font-bold text-white backdrop-blur-xl transition hover:scale-105 hover:bg-white/35"
          href="/"
        >
          Quay lai trang chu
        </Link>

        {error ? (
          <div className="rounded-lg border border-red-200/70 bg-white/45 p-6 text-zinc-900 shadow-xl shadow-red-950/10 backdrop-blur-xl">
            <h1 className="text-2xl font-black text-red-600">
              Khong ket noi duoc MySQL
            </h1>
            <p className="mt-3 rounded-md bg-white/60 px-3 py-2 text-sm text-zinc-700">
              Loi: {error}
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-white/40 bg-white/25 p-6 shadow-2xl shadow-fuchsia-900/10 backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
                Danh muc
              </p>
              <h1 className="mt-2 text-4xl font-black text-white drop-shadow-sm sm:text-5xl">
                {category.name}
              </h1>
              <p className="mt-3 max-w-2xl text-base font-medium text-white/85">
                Cac bai viet thuoc danh muc {category.name}.
              </p>
            </div>

            {posts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    className="group block rounded-lg border border-white/45 bg-white/25 p-5 shadow-xl shadow-cyan-950/10 backdrop-blur-xl transition duration-300 hover:scale-[1.03] hover:bg-white/40"
                    href={`/posts/${post.id}`}
                  >
                    <article>
                      <div className="mb-4 inline-flex rounded-full bg-white/45 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-950">
                        {category.name}
                      </div>
                      <h2 className="text-xl font-black text-zinc-950 transition duration-300 group-hover:text-fuchsia-700">
                        {post.title}
                      </h2>
                      <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-zinc-700">
                        {post.content}
                      </p>
                      {post.file_url ? (
                        <p className="mt-3 text-xs font-bold uppercase tracking-wide text-zinc-700">
                          Co tep dinh kem
                        </p>
                      ) : null}
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-white/40 bg-white/30 p-6 text-zinc-800 backdrop-blur-xl">
                Chua co bai viet nao trong danh muc nay.
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
