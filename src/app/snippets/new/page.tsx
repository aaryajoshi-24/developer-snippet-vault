
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function NewSnippetPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/snippets/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, language, content }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(
          result.error || "Could not generate AI tags and summary."
        );
      }

      const { summary, tags } = await response.json();

      const { error } = await supabase.from("snippets").insert({
        user_id: user.id,
        title: title.trim(),
        language,
        content,
        summary,
        tags,
      });

      if (error) {
        setMessage(error.message);
        return;
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
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F7F5] text-[#17231E]">
      {/* Top navigation */}
      <nav className="border-b border-white/10 bg-[#14231F] text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
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
              <span className="block font-bold tracking-tight">
                Snippet Vault
              </span>
              <span className="block text-xs text-emerald-100/70">
                Your personal code library
              </span>
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-emerald-50 hover:bg-white/10"
          >
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        {/* Page heading */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700">
            YOUR CODE LIBRARY
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Create a snippet
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64756C] sm:text-base">
            Save reusable code in one place. Gemini will generate a short
            explanation and useful tags for you.
          </p>
        </div>

        {/* AI information banner */}
        <div className="mb-6 flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3Z" />
            </svg>
          </span>
          <div>
            <p className="font-semibold text-emerald-950">
              AI-powered organization
            </p>
            <p className="mt-1 text-sm leading-5 text-emerald-900/80">
              When you save, Gemini creates a one-sentence summary and 3–5
              relevant tags automatically.
            </p>
          </div>
        </div>

        {/* Snippet form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-[#E0E8E3] bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6 border-b border-[#EDF1EE] pb-5">
              <h2 className="text-lg font-bold">Snippet details</h2>
              <p className="mt-1 text-sm text-[#64756C]">
                Give your code a recognizable title and language.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-[#34483D]"
                >
                  Snippet title <span className="text-emerald-700">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={150}
                  placeholder="e.g. Python List Example"
                  className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFB] px-4 py-3 text-sm text-[#17231E] outline-none transition placeholder:text-[#94A39B] focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
                <p className="mt-2 text-xs text-[#718078]">
                  Choose a short, descriptive title.
                </p>
              </div>

              <div>
                <label
                  htmlFor="language"
                  className="mb-2 block text-sm font-semibold text-[#34483D]"
                >
                  Programming language{" "}
                  <span className="text-emerald-700">*</span>
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFB] px-4 py-3 text-sm text-[#17231E] outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                >
                  {languages.map((item) => (
                    <option key={item} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-[#718078]">
                  Select the language used in your code.
                </p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#14231F] px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-semibold text-white">Code editor</h2>
                <p className="mt-1 text-xs text-emerald-100/70">
                  Paste or type your reusable code below.
                </p>
              </div>
              <span className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
                {language}
              </span>
            </div>

            <div className="bg-[#14231F] p-3 sm:p-5">
              <label htmlFor="content" className="sr-only">
                Code content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                maxLength={50000}
                rows={16}
                spellCheck={false}
                placeholder={"// Paste your code here...\n\nfunction example() {\n  // Your reusable code\n}"}
                className="min-h-[300px] w-full resize-y rounded-xl border border-white/10 bg-[#0E1915] p-4 font-mono text-sm leading-6 text-emerald-50 outline-none placeholder:text-emerald-100/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:p-5"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-100/60">
                <span>Maximum 50,000 characters</span>
                <span>{content.length.toLocaleString()} / 50,000</span>
              </div>
            </div>
          </section>

          {message && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
            >
              <p className="font-semibold">Unable to save snippet</p>
              <p className="mt-1">{message}</p>
            </div>
          )}

          {/* Form actions */}
          <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
            <Link
              href="/dashboard"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#DCE6DF] bg-white px-5 py-3 text-sm font-semibold text-[#46574F] hover:bg-[#F8FAF9]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-25"
                    />
                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Generating AI metadata...
                </>
              ) : (
                <>
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
                  Save Snippet
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-xs leading-5 text-[#718078]">
          Your snippets are saved to your personal vault. AI-generated
          metadata is created when you save.
        </p>
      </div>
    </main>
  );
}
