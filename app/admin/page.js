import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE } from "@/lib/auth";
import PostForm from "./PostForm";
import DeletePostButton from "./DeletePostButton";
import LogoutButton from "./LogoutButton";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isLoggedIn =
    cookieStore.get(AUTH_COOKIE_NAME)?.value === AUTH_COOKIE_VALUE;

  if (!isLoggedIn) {
    redirect("/login");
  }

  let posts = [];
  let dbError = null;

  try {
    [posts] = await db.query(
      "SELECT id, title, content, image FROM posts ORDER BY id DESC"
    );
  } catch (error) {
    dbError = error.message;
  }

  return (
    <main className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,#f0abfc_0,#8b5cf6_30%,#22d3ee_62%,#fef08a_100%)] px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex items-start justify-between gap-4 rounded-lg border border-white/45 bg-white/25 p-6 shadow-2xl shadow-violet-950/15 backdrop-blur-xl">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-white/80">
              Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-black text-white drop-shadow-sm">
              Admin CMS
            </h1>
            <p className="mt-2 font-medium text-white/85">
              Quan ly va them bai viet moi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              className="rounded-md border border-white/45 bg-white/25 px-3 py-2 text-sm font-bold text-white backdrop-blur-xl transition hover:scale-105 hover:bg-white/35"
              href="/"
            >
              Xem website
            </Link>
            <LogoutButton />
          </div>
        </div>

        <section className="grid gap-3 rounded-lg border border-white/45 bg-white/25 p-6 shadow-xl shadow-cyan-950/10 backdrop-blur-xl">
          <h2 className="text-xl font-black text-white">Them bai viet</h2>
          <PostForm />
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-black text-white drop-shadow-sm">
            Bai viet hien co
          </h2>
          {dbError ? (
            <div className="rounded-lg border border-red-200/70 bg-white/45 p-5 text-zinc-900 shadow-xl shadow-red-950/10 backdrop-blur-xl">
              <h3 className="font-black text-red-600">
                Khong ket noi duoc MySQL
              </h3>
              <p className="mt-2 font-medium">
                Hay kiem tra XAMPP/MySQL dang Start, database news_db ton tai,
                va refresh lai trang.
              </p>
              <p className="mt-3 rounded-md bg-white/60 px-3 py-2 text-sm text-zinc-700">
                Loi: {dbError}
              </p>
            </div>
          ) : null}
          <div className="grid gap-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-lg border border-white/45 bg-white/30 p-5 shadow-xl shadow-violet-950/10 backdrop-blur-xl transition duration-300 hover:scale-[1.02] hover:bg-white/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-black text-zinc-950">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-zinc-700">
                      {post.content}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      className="rounded-md border border-white/50 bg-white/35 px-3 py-1.5 text-sm font-bold text-zinc-800 transition hover:scale-105 hover:bg-white/55"
                      href={`/posts/${post.id}`}
                    >
                      Xem
                    </Link>
                    <DeletePostButton id={post.id} title={post.title} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
