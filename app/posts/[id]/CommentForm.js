"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CommentForm({ postId, username }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: postId,
          content,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || result.error || "Khong the gui binh luan");
        return;
      }

      setContent("");
      setMessage("Da gui binh luan");
      router.refresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/member/logout", {
      method: "POST",
    });
    router.refresh();
  }

  return (
    <form
      className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-5"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-zinc-700">
          Dang binh luan voi ten{" "}
          <span className="font-black text-zinc-950">{username}</span>
        </p>
        <button
          className="text-sm font-medium text-zinc-500 hover:text-zinc-950"
          onClick={handleLogout}
          type="button"
        >
          Dang xuat
        </button>
      </div>

      <textarea
        className="min-h-28 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none focus:border-zinc-950"
        placeholder="Viet binh luan cua ban..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        required
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-md bg-zinc-950 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Dang gui..." : "Gui binh luan"}
        </button>
        {message ? <p className="text-sm text-zinc-600">{message}</p> : null}
      </div>
    </form>
  );
}
