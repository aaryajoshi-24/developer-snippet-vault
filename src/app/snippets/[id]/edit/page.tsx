
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const languages = [
  "javascript",
  "typescript",
  "python",
  "java",
  "sql",
  "html",
  "css",
  "json",
  "bash",
  "text",
];

export default function EditSnippetPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSnippet() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("snippets")
        .select("title, language, content")
        .eq("id", params.id)
        .eq("user_id", user.id)
        .single();

      if (!active) return;

      if (error || !data) {
        setMessage("Snippet not found or you don't have access to it.");
        setLoading(false);
        return;
      }

      setTitle(data.title);
      setLanguage(data.language);
      setContent(data.content);
      setLoading(false);
    }

    loadSnippet();

    return () => {
      active = false;
    };
  }, [params.id, router, supabase]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/snippets/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          language,
          content,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(
          result.error || "Could not generate AI metadata."
        );
      }

      const { summary, tags } = await response.json();

      const { data, error } = await supabase
        .from("snippets")
        .update({
          title: title.trim(),
          language,
          content,
          summary,
          tags,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id)
        .eq("user_id", user.id)
        .select("id")
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error(
          "Snippet not found or you don't have access to it."
        );
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f7f5] px-4">
        <div className="rounded-2xl border border-[#e0e8e3] bg-white px-8 py-7 text-center shadow-sm">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
          <p className="font-medium text-[#17231e]">Loading your snippet...</p>
          <p className="mt-1 text-sm text-[#64756c]">
            Getting your code ready to edit.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f7f5] text-[#17231e]">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#14231f] text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-lg font-bold text-white">
              {"</>"}
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-wide">
                Snippet Vault
              </span>
              <span className="block text-xs text-emerald-100/70">
                Your personal code library
              </span>
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#64756c] hover:text-emerald-700"
          >
            <span aria-hidden="true">←</span>
            All snippets
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                SNIPPET WORKSPACE
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Edit snippet
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#64756c] sm:text-base">
                Refine your code. We’ll refresh its AI-generated summary and
                tags when you save your changes.
              </p>
            </div>
            <div className="hidden rounded-xl border border-[#e0e8e3] bg-white px-4 py-3 text-right sm:block">
              <p className="text-xs text-[#64756c]">AI assistance</p>
              <p className="mt-1 text-sm font-semibold text-emerald-700">
                Summary + tags
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 sm:p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
            ✦
          </div>
          <div>
            <p className="font-semibold text-emerald-950">
              AI-powered metadata refresh
            </p>
            <p className="mt-1 text-sm leading-6 text-emerald-900/75">
              When you save, Gemini will generate an updated summary and
              relevant tags based on your edited snippet.
            </p>
          </div>
        </div>

        {message && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-[#e0e8e3] bg-white shadow-sm">
            <div className="border-b border-[#e0e8e3] px-5 py-4 sm:px-7">
              <p className="text-base font-semibold">Snippet details</p>
              <p className="mt-1 text-sm text-[#64756c]">
                Give your code a clear, searchable title.
              </p>
            </div>

            <div className="space-y-5 p-5 sm:p-7">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold"
                >
                  Snippet title <span className="text-emerald-700">*</span>
                </label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={150}
                  placeholder="e.g. Python Even Numbers"
                  className="w-full rounded-xl border border-[#d5e0d9] bg-[#fbfcfb] px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
                <p className="mt-2 text-right text-xs text-[#87958d]">
                  {title.length}/150 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="language"
                  className="mb-2 block text-sm font-semibold"
                >
                  Programming language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-[#d5e0d9] bg-[#fbfcfb] px-4 py-3 text-sm capitalize outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                >
                  {languages.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#263b33] bg-[#14231f] shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-7">
              <div>
                <p className="font-semibold text-white">Code editor</p>
                <p className="mt-1 text-xs text-white/55">
                  Edit your saved code below.
                </p>
              </div>
              <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium capitalize text-emerald-200">
                {language}
              </span>
            </div>

            <div className="p-3 sm:p-5">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#101b17]">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-xs text-white/45">
                    snippet.{language === "python" ? "py" : language === "typescript" ? "ts" : language === "javascript" ? "js" : language === "text" ? "txt" : language}
                  </span>
                </div>
                <textarea
                  id="content"
                  aria-label="Code content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  maxLength={50000}
                  rows={16}
                  spellCheck={false}
                  placeholder="// Update your code here..."
                  className="block min-h-[320px] w-full resize-y border-0 bg-transparent px-4 py-5 font-mono text-sm leading-7 text-emerald-50 outline-none placeholder:text-white/25 focus:ring-0 sm:px-6"
                />
                <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-xs text-white/45 sm:px-6">
                  <span>Keep your code clean and reusable</span>
                  <span>{content.length.toLocaleString()}/50,000</span>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-[#d5e0d9] bg-white px-5 py-3 text-sm font-semibold text-[#42534a] hover:bg-[#f8faf9]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || !title.trim() || !content.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Updating snippet with AI...
                </>
              ) : (
                <>
                  Save changes
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>

          <p className="pb-4 text-center text-xs leading-5 text-[#87958d]">
            Your snippets remain private to your account.
          </p>
        </form>
      </div>
    </main>
  );
}
