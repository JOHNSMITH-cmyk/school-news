"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePostButton({ id, title }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(`Xoa bai viet "${title}"?`);

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        window.alert(result.message || result.error || "Khong the xoa bai viet");
        return;
      }

      router.refresh();
    } catch (error) {
      window.alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      className="shrink-0 rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-red-300"
      disabled={isDeleting}
      onClick={handleDelete}
      type="button"
    >
      {isDeleting ? "Dang xoa..." : "Xoa"}
    </button>
  );
}
