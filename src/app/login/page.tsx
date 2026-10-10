
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f7f5] text-[#17231e]">
      <header className="border-b border-white/10 bg-[#14231f] text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-lg font-bold">
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
            href="/signup"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/10"
          >
            Create account
          </Link>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <section className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            YOUR DEVELOPER WORKSPACE
          </div>

          <h1 className="mt-6 max-w-xl text-5xl font-bold leading-tight tracking-tight">
            Your best code,
            <br />
            <span className="text-emerald-600">always within reach.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-[#64756c]">
            Keep useful code snippets organized in one private library. Let AI
            generate summaries and tags so you can find the right code faster.
          </p>

          <div className="mt-9 space-y-4">
            {[
              {
                number: "01",
                title: "Save reusable code",
                description: "Keep helpful solutions together in one place.",
              },
              {
                number: "02",
                title: "Organize with AI",
                description: "Generate summaries and relevant tags.",
              },
              {
                number: "03",
                title: "Find and edit anytime",
                description: "Return to your snippets whenever you need them.",
              },
            ].map((item) => (
              <div key={item.number} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-xs font-bold text-emerald-700 shadow-sm">
                  {item.number}
                </span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-[#64756c]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9 max-w-lg rounded-2xl border border-[#263b33] bg-[#14231f] p-5 shadow-lg">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs text-white/50">
                reusable-code.py
              </span>
            </div>
            <div className="space-y-2 pt-4 font-mono text-sm">
              <p className="text-purple-300">def <span className="text-sky-300">useful_solution</span>():</p>
              <p className="pl-5 text-emerald-200">
                return "Ready when you need it"
              </p>
              <p className="pt-2 text-white/35"># Save once. Reuse anytime.</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["python", "reusable", "productivity"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-[#e0e8e3] bg-white p-6 shadow-sm sm:p-9">
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl text-emerald-700">
              ↗
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Welcome back
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Log in to your vault
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#64756c]">
              Enter your account details to access your saved snippets.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#d5e0d9] bg-[#fbfcfb] px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    {showPassword ? "Hide password" : "Show password"}
                  </button>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#d5e0d9] bg-[#fbfcfb] px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              {message && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Log in to your account"}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#e8eee9]" />
              <span className="text-xs text-[#87958d]">YOUR PRIVATE LIBRARY</span>
              <div className="h-px flex-1 bg-[#e8eee9]" />
            </div>

            <p className="text-center text-sm text-[#64756c]">
              New to Snippet Vault?{" "}
              <Link
                href="/signup"
                className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-[#87958d]">
            Your saved snippets are protected by your account.
          </p>
        </section>
      </div>
    </main>
  );
}
