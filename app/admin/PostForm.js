"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PostForm({ categories }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("image", image);
      formData.append("category_id", categoryId);

      if (file) {
        formData.append("file", file);
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || result.error || "Khong the them bai viet");
        return;
      }

      setTitle("");
      setContent("");
      setImage("");
      setCategoryId("");
      setFile(null);
      setFileInputKey((value) => value + 1);
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

      <div>
        <label
          className="block text-sm font-medium text-zinc-700"
          htmlFor="category"
        >
          Danh muc
        </label>
        <select
          id="category"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none focus:border-zinc-950"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          <option value="">Chon danh muc</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="file">
          Tep dinh kem
        </label>
        <input
          key={fileInputKey}
          id="file"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none file:mr-3 file:rounded-md file:border-0 file:bg-zinc-950 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white focus:border-zinc-950"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          type="file"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Toi da 10MB. Nguoi xem co the tai tep nay trong trang bai viet.
        </p>
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