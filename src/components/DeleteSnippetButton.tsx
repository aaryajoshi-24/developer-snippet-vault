
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
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="rounded-lg border border-red-800 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-950 disabled:opacity-60"
      >
        {loading ? "Deleting..." : "Delete"}
      </button>

      {message && (
        <p role="alert" className="mt-2 text-xs text-red-300">
          {message}
        </p>
      )}
    </div>
  );
}
