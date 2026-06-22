"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function MemberRegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/member/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, redirectTo }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || result.error || "Khong the dang ky");
        return;
      }

      router.push(result.redirectTo || "/");
      router.refresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="grid w-full max-w-sm gap-4 rounded-lg border border-zinc-200 bg-white p-5"
      onSubmit={handleSubmit}
    >
      <div>
        <label
          className="block text-sm font-medium text-zinc-700"
          htmlFor="username"
        >
          Ten hien thi
        </label>
        <input
          id="username"
          autoComplete="username"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none focus:border-zinc-950"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          autoComplete="email"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none focus:border-zinc-950"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
          autoComplete="new-password"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none focus:border-zinc-950"
          minLength={6}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      <button
        className="rounded-md bg-zinc-950 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Dang tao tai khoan..." : "Dang ky"}
      </button>

      {message ? <p className="text-sm text-red-600">{message}</p> : null}

      <p className="text-sm text-zinc-600">
        Da co tai khoan?{" "}
        <Link
          className="font-semibold text-violet-700 hover:text-violet-900"
          href={`/member/login?redirect=${encodeURIComponent(redirectTo)}`}
        >
          Dang nhap
        </Link>
      </p>
    </form>
  );
}
