
"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setSuccess(true);
        setMessage(
          "Account created! Check your email for the verification link. Open that link to verify your email and continue."
        );
      }
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
            href="/login"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/10"
          >
            Log in
          </Link>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <section className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            BUILT FOR DEVELOPERS
          </div>

          <h1 className="mt-6 max-w-xl text-5xl font-bold leading-tight tracking-tight">
            Build your own
            <br />
            <span className="text-emerald-600">library of solutions.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-[#64756c]">
            Stop searching through old projects for that one useful function.
            Save your code, organize it with AI, and keep your favourite
            solutions ready for the next project.
          </p>

          <div className="mt-9 grid max-w-lg grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#e0e8e3] bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-700">
                {"</>"}
              </div>
              <p className="mt-4 font-semibold">One code library</p>
              <p className="mt-2 text-sm leading-5 text-[#64756c]">
                Keep reusable snippets organized in one place.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e0e8e3] bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-700">
                ✦
              </div>
              <p className="mt-4 font-semibold">AI assistance</p>
              <p className="mt-2 text-sm leading-5 text-[#64756c]">
                Generate helpful summaries and relevant tags.
              </p>
            </div>
          </div>

          <div className="mt-6 max-w-lg rounded-2xl border border-[#263b33] bg-[#14231f] p-5 shadow-lg">
            <p className="text-xs font-medium uppercase tracking-widest text-emerald-300">
              Your next project starts here
            </p>
            <p className="mt-3 text-lg font-semibold text-white">
              Write it once. Save it. Reuse it.
            </p>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Create your account to start building your personal developer
              knowledge base.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-[#e0e8e3] bg-white p-6 shadow-sm sm:p-9">
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl text-emerald-700">
              +
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Get started
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Create your account
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#64756c]">
              Set up your account and start saving useful code snippets.
            </p>

            <form onSubmit={handleSignup} className="mt-8 space-y-5">
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
                    Create password
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
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-[#d5e0d9] bg-[#fbfcfb] px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />

                <p className="mt-2 text-xs text-[#87958d]">
                  Use at least 6 characters.
                </p>
              </div>

              {message && (
                <div
                  role={success ? "status" : "alert"}
                  aria-live="polite"
                  className={`rounded-xl border px-4 py-3 text-sm leading-6 ${
                    success
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {success && (
                    <p className="mb-1 font-semibold">
                      Check your inbox
                    </p>
                  )}
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create my account"}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#64756c]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-[#87958d]">
            Email verification helps confirm your account.
          </p>
        </section>
      </div>
    </main>
  );
}
