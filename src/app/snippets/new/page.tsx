
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
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      let summary = "Saved without an AI-generated summary.";
      let tags: string[] = [language.toLowerCase(), "manual"];

      // AI metadata is optional. Saving the snippet is the priority.
      try {
        const response = await fetch("/api/snippets/metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            language,
            content,
          }),
        });

        const result = await response.json().catch(() => ({}));

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (response.ok) {
          if (
            typeof result.summary === "string" &&
            Array.isArray(result.tags)
          ) {
            summary = result.summary;
            tags = result.tags.filter(
              (tag: unknown): tag is string =>
                typeof tag === "string"
            );
          }
        } else {
          console.warn(
            "AI metadata unavailable. Saving with fallback metadata:",
            result.error || response.status
          );
        }
      } catch (aiError) {
        console.warn(
          "AI request failed. Saving without AI metadata:",
          aiError
        );
      }

      // Save the snippet even if Gemini is unavailable.
      const { error: saveError } = await supabase
        .from("snippets")
        .insert({
          user_id: user.id,
          title: title.trim(),
          language,
          content,
          summary,
          tags,
        });

      if (saveError) {
        setMessage(saveError.message);
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
      <nav className="border-b border-white/10 bg-[#14231F] text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white text-xl">
              {"</>"}
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
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700">
            YOUR CODE LIBRARY
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Create a snippet
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64756C] sm:text-base">
            Save reusable code in one place. Gemini can generate
            a short explanation and useful tags when available.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
          <p className="font-semibold text-emerald-950">
            AI-powered organization
          </p>
          <p className="mt-1 text-sm leading-5 text-emerald-900/80">
            AI generates a summary and tags when available.
            If the AI service fails, your code can still be saved.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-[#E0E8E3] bg-white p-5 shadow-sm sm:p-8">
            <h2 className="mb-6 border-b border-[#EDF1EE] pb-5 text-lg font-bold">
              Snippet details
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-[#34483D]"
                >
                  Snippet title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={150}
                  placeholder="e.g. Python List Example"
                  className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFB] px-4 py-3 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label
                  htmlFor="language"
                  className="mb-2 block text-sm font-semibold text-[#34483D]"
                >
                  Programming language *
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE6DF] bg-[#FAFCFB] px-4 py-3 text-sm outline-none focus:border-emerald-500"
                >
                  {languages.map((item) => (
                    <option key={item} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-sm">
            <div className="flex items-center justify-between bg-[#14231F] px-5 py-4">
              <div>
                <h2 className="font-semibold text-white">Code editor</h2>
                <p className="mt-1 text-xs text-emerald-100/70">
                  Paste or type your reusable code below.
                </p>
              </div>
              <span className="rounded-lg bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-200">
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
                className="min-h-[300px] w-full resize-y rounded-xl border border-white/10 bg-[#0E1915] p-4 font-mono text-sm leading-6 text-emerald-50 outline-none placeholder:text-emerald-100/30 focus:border-emerald-500 sm:p-5"
              />
              <div className="mt-3 flex justify-between gap-2 text-xs text-emerald-100/60">
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
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving snippet..." : "Save Snippet"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-xs leading-5 text-[#718078]">
          Your snippets are saved to your personal vault.
          AI metadata is optional.
        </p>
      </div>
    </main>
  );
}
