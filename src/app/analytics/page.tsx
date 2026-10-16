
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CodePreview from "@/components/CodePreview";

type FavoriteSnippet = {
  id: string;
  title: string;
  language: string;
  content: string;
  collectionName: string | null;
  created_at: string;
};

type AnalyticsData = {
  totalSnippets: number;
  totalLanguages: number;
  favoritesCount: number;
  collectionsCount: number;
  languages: {
    language: string;
    count: number;
  }[];
  recentSnippets: {
    id: string;
    title: string;
    language: string;
    created_at: string;
  }[];
  favoriteSnippets?: FavoriteSnippet[];
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const response = await fetch("/api/analytics");

        let result: AnalyticsData | { error?: string } | null = null;
        try {
          result = await response.json();
        } catch {
          // Safe catch in case response is empty or non-JSON
        }

        if (!response.ok) {
          const errMessage =
            result && "error" in result && typeof result.error === "string"
              ? result.error
              : "Unable to load analytics. Please log in again if needed.";
          throw new Error(errMessage);
        }

        setData(result as AnalyticsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

    const favoriteList = data?.favoriteSnippets ?? [];

    const stats = [
    {
      label: "Total Snippets",
      value: data?.totalSnippets ?? 0,
      icon: "📝",
    },
    {
      label: "Languages",
      value: data?.totalLanguages ?? 0,
      icon: "💻",
    },
    {
      label: "Favorites",
      value: data?.favoritesCount ?? 0,
      icon: "⭐",
      href: "#favorites",
    },
    {
      label: "Collections",
      value: data?.collectionsCount ?? 0,
      icon: "📁",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-3.5 py-2 text-xs font-semibold text-gray-300 shadow-xs transition hover:border-gray-700 hover:bg-gray-800 hover:text-white active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3.5 w-3.5 text-emerald-400"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-gray-400">
            Get an overview of your saved code snippets.
          </p>
        </div>

        {loading && (
          <p className="py-10 text-gray-300">Loading analytics...</p>
        )}

        {error && (
          <div className="rounded-xl border border-red-800 bg-red-950 p-4 text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const card = (
                  <div className="h-full rounded-2xl border border-gray-800 bg-gray-900 p-6 transition hover:border-gray-700">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <span className="text-2xl">{stat.icon}</span>
                    </div>
                    <p className="mt-4 text-3xl font-bold">{stat.value}</p>
                  </div>
                );

                return stat.href ? (
                  <a key={stat.label} href={stat.href} className="block group">
                    {card}
                  </a>
                ) : (
                  <div key={stat.label}>{card}</div>
                );
              })}
            </div>

            {/* Actual Favorite Code Snippets Section */}
            <section
              id="favorites"
              className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 scroll-mt-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl" aria-hidden="true">
                      ⭐
                    </span>
                    <h2 className="text-xl font-semibold">
                      Favorite Code Snippets
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-gray-400">
                    Direct access to the actual code of snippets you have marked as favorites.
                  </p>
                </div>

                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  {favoriteList.length}{" "}
                  {favoriteList.length === 1 ? "favorite" : "favorites"}
                </span>
              </div>

              {favoriteList.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-gray-800 bg-gray-950 p-8 text-center">
                  <p className="text-sm font-semibold text-gray-300">
                    No favorite snippets yet
                  </p>
                  <p className="mt-1.5 text-xs text-gray-500">
                    Mark snippets with a star from your dashboard to view and reference their actual code here.
                  </p>
                  <Link
                    href="/dashboard"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <div className="mt-6 space-y-6">
                  {favoriteList.map((snippet) => (
                    <article
                      key={snippet.id}
                      className="overflow-hidden rounded-xl border border-gray-800 bg-gray-950 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800/80 bg-gray-900/60 px-5 py-3.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span
                            className="text-amber-400 font-bold"
                            aria-hidden="true"
                          >
                            ★
                          </span>
                          <h3 className="text-sm font-semibold text-white">
                            {snippet.title}
                          </h3>
                          <span className="rounded-md border border-emerald-800/60 bg-emerald-950 px-2 py-0.5 text-xs font-medium lowercase text-emerald-300">
                            {snippet.language}
                          </span>
                          {snippet.collectionName && (
                            <span className="rounded-md border border-amber-800/60 bg-amber-950/70 px-2 py-0.5 text-xs font-medium text-amber-300">
                              📁 {snippet.collectionName}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">
                            Saved{" "}
                            {new Date(snippet.created_at).toLocaleDateString()}
                          </span>
                          <Link
                            href={`/dashboard?q=${encodeURIComponent(snippet.title)}`}
                            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 underline transition"
                          >
                            Open in Dashboard
                          </Link>
                        </div>
                      </div>

                      <div className="p-0">
                        <CodePreview
                          code={snippet.content}
                          language={snippet.language}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="text-xl font-semibold">
                Languages Breakdown
              </h2>

              {data.languages.length === 0 ? (
                <p className="mt-4 text-gray-400">
                  No language data available.
                </p>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {data.languages.map((item) => (
                    <div
                      key={item.language}
                      className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-950 p-4"
                    >
                      <span className="font-medium text-emerald-400">
                        {item.language}
                      </span>
                      <span className="rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-300">
                        {item.count} {item.count === 1 ? "snippet" : "snippets"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="text-xl font-semibold">
                Recently Saved Snippets
              </h2>

              {data.recentSnippets.length === 0 ? (
                <p className="mt-4 text-gray-400">
                  No snippets saved yet.
                </p>
              ) : (
                <div className="mt-4 divide-y divide-gray-800">
                  {data.recentSnippets.map((snippet) => (
                    <div
                      key={snippet.id}
                      className="flex flex-col justify-between gap-2 py-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-medium">
                          {snippet.title || "Untitled Snippet"}
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          {snippet.language}
                        </p>
                      </div>

                      <p className="text-sm text-gray-500">
                        {new Date(
                          snippet.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
