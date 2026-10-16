
"use client";

import { useEffect, useState } from "react";

type Organization = {
  is_favorite: boolean;
  collection_name: string | null;
};

type Props = {
  snippetId: string;
};

export default function SnippetOrganization({ snippetId }: Props) {
  const [favorite, setFavorite] = useState(false);
  const [collection, setCollection] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrganization() {
      try {
        const response = await fetch(
          `/api/snippets/organization?snippetId=${encodeURIComponent(snippetId)}`
        );

        let data: {
          organizations?: Array<Organization & { snippet_id: string }>;
          organization?: (Organization & { snippet_id: string }) | null;
          error?: string;
        } | null = null;

        try {
          data = await response.json();
        } catch {
          // If response body is empty or non-JSON
        }

        if (!response.ok) {
          throw new Error(data?.error || "Unable to load organization.");
        }

        const record =
          data?.organization ??
          data?.organizations?.find((item) => item.snippet_id === snippetId);

        if (!cancelled && record) {
          setFavorite(record.is_favorite);
          setCollection(record.collection_name ?? "");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load settings."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadOrganization();

    return () => {
      cancelled = true;
    };
  }, [snippetId]);

  async function saveOrganization(nextFavorite: boolean, nextCollection: string) {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/snippets/organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          snippetId,
          isFavorite: nextFavorite,
          collectionName: nextCollection,
        }),
      });

      let data: {
        organization?: Organization & { snippet_id: string };
        error?: string;
      } | null = null;

      try {
        data = await response.json();
      } catch {
        // Non-JSON response
      }

      if (!response.ok) {
        throw new Error(data?.error || "Unable to save changes.");
      }

      if (data?.organization) {
        setFavorite(data.organization.is_favorite);
        setCollection(data.organization.collection_name ?? "");
      }
      setMessage("Saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save changes."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-4 rounded-xl border border-amber-200/70 bg-amber-50/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-950">
          Favorites &amp; Collections
        </h3>
        {favorite && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
            ★ Favorited
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={loading || saving}
          onClick={() => void saveOrganization(!favorite, collection)}
          aria-pressed={favorite}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition shadow-xs disabled:cursor-not-allowed disabled:opacity-50 active:scale-95 ${
            favorite
              ? "border border-amber-300 bg-amber-100 text-amber-950 font-semibold hover:bg-amber-200/90"
              : "border border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50/60 hover:text-amber-950"
          }`}
        >
          <span className={favorite ? "text-amber-600 font-bold" : "text-gray-400"}>
            {favorite ? "★" : "☆"}
          </span>
          <span>{favorite ? "Remove from Favorites" : "Add to Favorites"}</span>
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={collection}
          onChange={(event) => setCollection(event.target.value)}
          maxLength={80}
          placeholder="Collection name (e.g. Interview Prep)"
          aria-label="Collection name"
          className="min-h-9 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs placeholder:text-gray-400"
        />

        <button
          type="button"
          disabled={loading || saving}
          onClick={() => void saveOrganization(favorite, collection)}
          className="inline-flex min-h-9 items-center justify-center rounded-lg bg-amber-600 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-amber-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Collection"}
        </button>
      </div>

      {loading && (
        <p className="mt-2 text-[11px] text-gray-500">Loading saved settings...</p>
      )}
      {message && (
        <p role="status" className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-700">
          <span>✓</span>
          <span>{message}</span>
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}
