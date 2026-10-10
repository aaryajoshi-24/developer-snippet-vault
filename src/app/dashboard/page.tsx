import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeleteSnippetButton from "@/components/DeleteSnippetButton";
import CodePreview from "@/components/CodePreview";
import MarkdownPreview from "@/components/MarkdownPreview";

export default async function DashboardPage() {
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

  const snippetCount = snippets?.length ?? 0;

  return (
    <main className="min-h-screen bg-[#F4F7F5] text-[#17231E]">
      {/* Top navigation */}
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
        {/* Page heading */}
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
              Keep your best code organized, searchable by sight, and ready
              to reuse whenever you need it.
            </p>
          </div>

          <Link
            href="/snippets/new"
            className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/10 hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:self-auto"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Snippet
          </Link>
        </section>

        {/* Overview cards */}
        <section
          aria-label="Workspace overview"
          className="mt-8 grid gap-4 sm:grid-cols-2"
        >
          <div className="rounded-2xl border border-[#E0E8E3] bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#64756C]">
                  Saved snippets
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight">
                  {snippetCount.toString().padStart(2, "0")}
                </p>
                <p className="mt-2 text-xs text-[#64756C]">
                  Your personal code collection
                </p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M7 3.75h7l5 5V20a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5.75a2 2 0 0 1 2-2Z" />
                  <path d="M14 4v5h5M8.5 13h7M8.5 16.5h7" />
                </svg>
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E0E8E3] bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#64756C]">
                  AI assistance
                </p>
                <p className="mt-3 text-2xl font-bold tracking-tight">
                  Smarter snippets
                </p>
                <p className="mt-2 text-xs text-[#64756C]">
                  Gemini summaries and relevant tags
                </p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" />
                  <path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" />
                </svg>
              </span>
            </div>
          </div>
        </section>

        {/* Snippet list */}
        <section className="mt-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Your collection
              </h2>
              <p className="mt-1 text-sm text-[#64756C]">
                Your saved code and AI-generated notes.
              </p>
            </div>

            <span className="rounded-full border border-[#E0E8E3] bg-white px-3 py-1.5 text-xs font-medium text-[#64756C]">
              {snippetCount} {snippetCount === 1 ? "snippet" : "snippets"}
            </span>
          </div>

          {error ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
            >
              Unable to load snippets: {error.message}
            </div>
          ) : !snippets || snippets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#CBD9D0] bg-white px-6 py-16 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-7 w-7"
                  aria-hidden="true"
                >
                  <path d="M8 8 4 12l4 4M16 8l4 4-4 4M14 4l-4 16" />
                </svg>
              </span>
              <h3 className="mt-5 text-lg font-bold">
                Your vault is ready
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#64756C]">
                Save your first useful code snippet. Gemini will generate
                a short summary and tags to help organize it.
              </p>
              <Link
                href="/snippets/new"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Create your first snippet
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {snippets.map((snippet) => (
                <article
                  key={snippet.id}
                  className="group min-w-0 overflow-hidden rounded-2xl border border-[#E0E8E3] bg-white shadow-sm shadow-slate-900/[0.025] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md hover:shadow-slate-900/[0.05]"
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
                        <span className="mt-2 inline-flex rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold lowercase text-emerald-800">
                          {snippet.language}
                        </span>
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

                    {/* Render formatted Markdown only for Markdown snippets */}
                    {snippet.language.toLowerCase().trim() === "markdown" && (
                      <div className="mt-5 rounded-xl border border-[#E0E8E3] bg-white p-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#718078]">
                          Markdown Preview
                        </p>
                        <MarkdownPreview content={snippet.content} />
                      </div>
                    )}

                    {/* Syntax-highlighted code preview */}
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
                    </div>

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
                          className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[#DCE6DF] px-3 py-2 text-xs font-semibold text-[#34483D] hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                        >
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
