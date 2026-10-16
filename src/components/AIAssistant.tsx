
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

type Action =
  | "explain"
  | "bugs"
  | "improve"
  | "documentation"
  | "complexity";

type Props = {
  language: string;
  content: string;
};

const actions: { value: Action; label: string; icon: string }[] = [
  { value: "explain", label: "Explain Code", icon: "💡" },
  { value: "bugs", label: "Find Bugs", icon: "🐛" },
  { value: "improve", label: "Improve Code", icon: "⚡" },
  { value: "documentation", label: "Generate Docs", icon: "📄" },
  { value: "complexity", label: "Analyze Complexity", icon: "⏱️" },
];

export default function AIAssistant({
  language,
  content,
}: Props) {
  const [result, setResult] = useState("");
  const [activeAction, setActiveAction] = useState<Action | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function runAssistant(action: Action) {
    setActiveAction(action);
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/snippets/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, language, content }),
      });

      let data: { result?: string; error?: string } | null = null;
      try {
        data = await response.json();
      } catch {
        // Handle non-JSON or empty response
      }

      if (!response.ok) {
        throw new Error(data?.error || "AI request failed.");
      }

      if (!data?.result) {
        throw new Error("AI assistant returned an empty result.");
      }

      setResult(data.result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore copy error
    }
  }

  return (
    <section className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-950">
          AI Code Assistant
        </h3>
        <span className="text-[11px] font-medium text-emerald-700/80">
          Powered by Gemini
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          const isCurrentLoading = loading && activeAction === action.value;
          return (
            <button
              key={action.value}
              type="button"
              onClick={() => runAssistant(action.value)}
              disabled={loading || !content.trim()}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition shadow-xs disabled:cursor-not-allowed disabled:opacity-50 ${
                isCurrentLoading
                  ? "bg-emerald-600 text-white border border-emerald-600 animate-pulse"
                  : "border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-100/70 hover:border-emerald-300 active:scale-95"
              }`}
            >
              <span aria-hidden="true">{action.icon}</span>
              <span>
                {isCurrentLoading ? "Analyzing..." : action.label}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-xs text-red-600">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-4 rounded-xl border border-emerald-200/80 bg-white p-4 shadow-xs">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                AI Analysis Result
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition"
              >
                {copied ? (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      className="h-3 w-3 text-emerald-600"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span className="text-emerald-700 font-semibold">
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-3 w-3 text-gray-500"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setResult("")}
                className="rounded-md border border-transparent p-1 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                aria-label="Close AI result"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-3.5 w-3.5"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="max-h-[550px] overflow-auto pr-1 text-xs leading-relaxed text-gray-800">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                h1: ({ children }) => (
                  <h1 className="mt-3 mb-2 text-base font-bold text-gray-900 border-b border-gray-100 pb-1">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mt-3 mb-1.5 text-sm font-bold text-gray-900">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mt-2.5 mb-1 text-xs font-bold uppercase tracking-wider text-emerald-950">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="mt-2 mb-1 text-xs font-semibold text-gray-800">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="my-1.5 text-xs leading-relaxed text-gray-700">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="my-1.5 list-disc space-y-1 pl-5 text-xs text-gray-700">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-1.5 list-decimal space-y-1 pl-5 text-xs text-gray-700">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-800">{children}</em>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="my-2 border-l-4 border-emerald-400 bg-emerald-50/50 py-1.5 pl-3 text-xs italic text-gray-700 rounded-r">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="my-2.5 overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-emerald-50/70 text-emerald-950 font-semibold">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {children}
                  </tbody>
                ),
                tr: ({ children }) => (
                  <tr className="hover:bg-gray-50/60 transition-colors">
                    {children}
                  </tr>
                ),
                th: ({ children }) => (
                  <th className="px-3 py-2 text-left font-semibold text-xs text-gray-900">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-3 py-2 text-xs text-gray-700 whitespace-normal">
                    {children}
                  </td>
                ),
                pre: ({ children }) => (
                  <pre className="my-2.5 overflow-x-auto rounded-lg bg-[#14231F] p-3 text-xs text-emerald-100 font-mono border border-emerald-950/40">
                    {children}
                  </pre>
                ),
                code: ({ className, children, ...props }) => {
                  const isBlock =
                    Boolean(className) ||
                    (typeof children === "string" && children.includes("\n"));
                  if (!isBlock) {
                    return (
                      <code
                        className="rounded bg-emerald-100/70 px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-emerald-950 border border-emerald-200/80"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code
                      className={`${className || ""} font-mono text-xs`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                hr: () => <hr className="my-3 border-gray-200" />,
              }}
            >
              {result}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </section>
  );
}
