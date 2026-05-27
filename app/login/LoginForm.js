"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || result.error || "Khong the dang nhap");
        return;
      }

      router.push("/admin");
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
      className="grid w-full max-w-sm gap-4 rounded-lg border border-zinc-200 bg-white p-5"
    >
      <div>
        <label
          className="block text-sm font-medium text-zinc-700"
          htmlFor="username"
        >
          Ten dang nhap
        </label>
        <input
          id="username"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none focus:border-zinc-950"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium text-zinc-700"
          htmlFor="password"
        >
          Mat khau
        </label>
        <input
          id="password"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none focus:border-zinc-950"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          type="password"
          required
        />
      </div>

      <button
        className="rounded-md bg-zinc-950 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Dang dang nhap..." : "Dang nhap"}
      </button>

      {message ? <p className="text-sm text-red-600">{message}</p> : null}
    </form>
  );
}
