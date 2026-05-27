"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, image }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || result.error || "Khong the them bai viet");
        return;
      }

      setTitle("");
      setContent("");
      setImage("");
      setMessage("Da them bai viet");
      router.refresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-5"
    >
      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="title">
          Tieu de
        </label>
        <input
          id="title"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none focus:border-zinc-950"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="content">
          Noi dung
        </label>
        <textarea
          id="content"
          className="mt-1 min-h-32 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none focus:border-zinc-950"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="image">
          Anh
        </label>
        <input
          id="image"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none focus:border-zinc-950"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          className="rounded-md bg-zinc-950 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Dang them..." : "Them bai viet"}
        </button>
        {message ? <p className="text-sm text-zinc-600">{message}</p> : null}
      </div>
    </form>
  );
}
