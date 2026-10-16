
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteSnippetButton({
  snippetId,
}: {
  snippetId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this snippet? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/snippets/${snippetId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Unable to delete snippet.");
        return;
      }

      router.refresh();
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-xs transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-3.5 w-3.5"
          aria-hidden="true"
        >
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        {loading ? "Deleting..." : "Delete"}
      </button>

      {message && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {message}
        </p>
      )}
    </div>
  );
}
