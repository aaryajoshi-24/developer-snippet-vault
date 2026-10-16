
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeleteSnippetButton from "@/components/DeleteSnippetButton";
import CodePreview from "@/components/CodePreview";
import MarkdownPreview from "@/components/MarkdownPreview";
import ScanSnippetButton from "@/components/ScanSnippetButton";
import AIAssistant from "@/components/AIAssistant";
import SnippetOrganization from "@/components/SnippetOrganization";

type DashboardSearchParams = {
  q?: string;
  language?: string;
  sort?: string;
  favorites?: string;
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<DashboardSearchParams>;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim().toLowerCase();
  const selectedLanguage = params.language ?? "all";
  const sort = params.sort === "oldest" ? "oldest" : "newest";
  const showFavoritesOnly = params.favorites === "true";

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: snippets, error } = await supabase
    .from("snippets")
    .select("id, title, content, language, summary, tags, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: userOrgs } = await supabase
    .from("snippet_organization")
    .select("snippet_id, is_favorite, collection_name")
    .eq("user_id", user.id);

  const favoriteSnippetIdSet = new Set(
    (userOrgs ?? [])
      .filter((item) => item.is_favorite)
      .map((item) => item.snippet_id)
  );

  const allSnippets = snippets ?? [];
  const snippetCount = allSnippets.length;

  const languages = [
    ...new Set(
      allSnippets.map((snippet) => snippet.language.toLowerCase())
    ),
  ].sort();

  const filteredSnippets = allSnippets
    .filter((snippet) => {
      const matchesSearch =
        !query ||
        snippet.title.toLowerCase().includes(query) ||
        snippet.content.toLowerCase().includes(query) ||
        snippet.language.toLowerCase().includes(query) ||
        (snippet.summary ?? "").toLowerCase().includes(query) ||
        (snippet.tags ?? []).some((tag: string) =>
          tag.toLowerCase().includes(query)
        );

      const matchesLanguage =
        selectedLanguage === "all" ||
        snippet.language.toLowerCase() === selectedLanguage.toLowerCase();

      const matchesFavorites =
        !showFavoritesOnly || favoriteSnippetIdSet.has(snippet.id);

      return matchesSearch && matchesLanguage && matchesFavorites;
    })
    .sort((a, b) => {
      const difference =
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime();

      return sort === "oldest" ? difference : -difference;
    });

  return (
    <main className="min-h-screen bg-[#F4F7F5] text-[#17231E]">
      <nav className="sticky top-0 z-20 border-b border-white/10 bg-[#14231F] text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />
              </svg>
            </span>
            <span>
              <span className="block text-base font-bold tracking-tight">
                Snippet Vault
              </span>
              <span className="block text-xs text-emerald-100/70">
                Your personal code library
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/analytics"
              className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-white/10"
            >
              Analytics
            </Link>
            <span className="hidden max-w-56 truncate text-sm text-emerald-50/80 sm:block">
              {user.email}
            </span>
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-semibold text-emerald-200 ring-1 ring-emerald-400/30"
              title={user.email ?? "Account"}
            >
              {(user.email?.[0] ?? "U").toUpperCase()}
            </span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              YOUR WORKSPACE
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Snippets
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#64756C] sm:text-base">
              Keep your best code organized, searchable, and ready to reuse
              whenever you need it.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            <Link
              href="/analytics"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#DCE6DF] bg-white px-4 py-2.5 text-sm font-semibold text-[#17231E] shadow-xs transition hover:border-gray-300 hover:bg-gray-50 active:scale-95"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-emerald-600" aria-hidden="true">
                <path d="M18 20V10M12 20V4M6 20v-6" />
              </svg>
              Analytics
            </Link>

            <Link
              href="/snippets/new"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-emerald-700 active:scale-95"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Snippet
            </Link>
          </div>
        </section>

        <section
          aria-label="Workspace overview"
          className="mt-8 grid gap-4 sm:grid-cols-2"
        >
          <div className="rounded-2xl border border-[#E0E8E3] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#64756C]">
              Saved snippets
            </p>
            <p className="mt-3 text-3xl font-bold">
              {snippetCount.toString().padStart(2, "0")}
            </p>
            <p className="mt-2 text-xs text-[#64756C]">
              Your personal code collection
            </p>
          </div>

          <div className="rounded-2xl border border-[#E0E8E3] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#64756C]">
              AI assistance
            </p>
            <p className="mt-3 text-2xl font-bold">Smarter snippets</p>
            <p className="mt-2 text-xs text-[#64756C]">
              Gemini summaries, tags, explanations, and code reviews
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Your collection
              </h2>
              <p className="mt-1 text-sm text-[#64756C]">
                Search, filter, and organize your saved code.
              </p>
            </div>

            <span className="rounded-full border border-[#E0E8E3] bg-white px-3 py-1.5 text-xs font-medium text-[#64756C]">
              {filteredSnippets.length} of {snippetCount} snippets
            </span>
          </div>

          <form
            action="/dashboard"
            method="GET"
            className="mb-6 grid gap-3 rounded-2xl border border-[#E0E8E3] bg-white p-4 sm:grid-cols-3"
          >
            <input
              type="search"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search title, code, summary, or tags..."
              aria-label="Search snippets"
              className="min-h-11 rounded-lg border border-[#DCE6DF] bg-white px-3.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:col-span-3 shadow-xs"
            />

            <select
              name="language"
              defaultValue={selectedLanguage}
              aria-label="Filter by programming language"
              className="min-h-11 rounded-lg border border-[#DCE6DF] bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
            >
              <option value="all">All languages</option>
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>

            <select
              name="sort"
              defaultValue={sort}
              aria-label="Sort snippets"
              className="min-h-11 rounded-lg border border-[#DCE6DF] bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>

            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-xs transition hover:bg-emerald-700 active:scale-95"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Search &amp; Filter
            </button>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 sm:col-span-3">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="favorites"
                  value="true"
                  defaultChecked={showFavoritesOnly}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>⭐ Show favorites only ({favoriteSnippetIdSet.size})</span>
              </label>

              <Link
                href="/dashboard"
                className="text-xs font-medium text-emerald-700 hover:text-emerald-900 transition"
              >
                Clear all filters
              </Link>
            </div>
          </form>

          {error ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
            >
              Unable to load snippets: {error.message}
            </div>
          ) : snippetCount === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#CBD9D0] bg-white px-6 py-16 text-center">
              <h3 className="text-lg font-bold">Your vault is ready</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#64756C]">
                Save your first code snippet. Gemini will generate a short
                summary and tags to help organize it.
              </p>
              <Link
                href="/snippets/new"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Create your first snippet
              </Link>
            </div>
          ) : filteredSnippets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#CBD9D0] bg-white p-10 text-center">
              <h3 className="text-lg font-bold">No matching snippets</h3>
              <p className="mt-2 text-sm text-[#64756C]">
                {showFavoritesOnly
                  ? "No favorited snippets match your search criteria."
                  : "Try another search term or change your filters."}
              </p>
              <Link
                href="/dashboard"
                className="mt-4 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {filteredSnippets.map((snippet) => (
                <article
                  key={snippet.id}
                  className="group min-w-0 overflow-hidden rounded-2xl border border-[#E0E8E3] bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <path d="M8 8 4 12l4 4M16 8l4 4-4 4M14 4l-4 16" />
                        </svg>
                      </span>

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-base font-bold leading-6 text-[#17231E]">
                          {snippet.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="inline-flex rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold lowercase text-emerald-800">
                            {snippet.language}
                          </span>
                          {favoriteSnippetIdSet.has(snippet.id) && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-amber-200/80 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
                              ★ Favorited
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {snippet.summary && (
                      <div className="mt-5">
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#718078]">
                          AI summary
                        </p>
                        <p className="text-sm leading-6 text-[#46574F]">
                          {snippet.summary}
                        </p>
                      </div>
                    )}

                    {snippet.language.toLowerCase().trim() === "markdown" && (
                      <div className="mt-5 rounded-xl border border-[#E0E8E3] bg-white p-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#718078]">
                          Markdown Preview
                        </p>
                        <MarkdownPreview content={snippet.content} />
                      </div>
                    )}

                    <div className="mt-5 overflow-hidden rounded-xl border border-[#253A31] bg-[#14231F]">
                      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                        <span className="text-xs font-medium text-emerald-100/70">
                          CODE PREVIEW
                        </span>
                        <span className="text-xs text-emerald-300">
                          {snippet.language}
                        </span>
                      </div>

                      <CodePreview
                        code={snippet.content}
                        language={snippet.language}
                      />

                      <ScanSnippetButton code={snippet.content} />
                    </div>

                    <AIAssistant
                      language={snippet.language}
                      content={snippet.content}
                    />

                    <SnippetOrganization snippetId={snippet.id} />

                    {snippet.tags && snippet.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {snippet.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="rounded-full border border-emerald-100 bg-emerald-50/70 px-2.5 py-1 text-xs font-medium text-emerald-800"
                          >
                            #{tag.replace(/^#/, "")}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#EDF1EE] pt-4">
                      <p className="text-xs text-[#718078]">
                        Saved{" "}
                        {new Date(snippet.created_at).toLocaleDateString()}
                      </p>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/snippets/${snippet.id}/edit`}
                          className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-xs font-semibold text-[#34483D] shadow-xs transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 active:scale-95"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Edit
                        </Link>

                        <DeleteSnippetButton snippetId={snippet.id} />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-[#E0E8E3] py-5 text-center text-xs text-[#718078]">
          Developer Snippet Vault · Your code, organized.
        </footer>
      </div>
    </main>
  );
}
