
import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Save your code",
    description:
      "Store useful functions, queries, and reusable solutions in your own organized library.",
    icon: "</>",
  },
  {
    number: "02",
    title: "Let AI organize",
    description:
      "Generate meaningful summaries and relevant tags for your snippets with Gemini AI.",
    icon: "✦",
  },
  {
    number: "03",
    title: "Find it faster",
    description:
      "Keep your coding knowledge in one place so useful solutions are ready when you need them.",
    icon: "⌕",
  },
];

const sampleCode = [
  { number: "01", code: "def get_even_numbers(numbers):", color: "text-sky-300" },
  { number: "02", code: "    return [n for n in numbers if n % 2 == 0]", color: "text-emerald-200" },
  { number: "03", code: "" , color: "text-white" },
  { number: "04", code: "numbers = [1, 2, 3, 4, 5, 6]", color: "text-amber-200" },
  { number: "05", code: "print(get_even_numbers(numbers))", color: "text-emerald-200" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7f5] text-[#17231e]">
      <header className="relative z-10 border-b border-white/10 bg-[#14231f] text-white">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-lg font-bold">
              {"</>"}
            </span>
            <span>
              <span className="block text-base font-semibold tracking-wide">
                Snippet Vault
              </span>
              <span className="block text-xs text-emerald-100/65">
                Your personal code library
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/login"
              className="px-2 py-2 text-sm font-medium text-white/80 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-400 sm:px-5"
            >
              Get started <span aria-hidden="true">→</span>
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative">
        <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-52 h-80 w-80 rounded-full bg-teal-100/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3.5 py-2 text-xs font-semibold text-emerald-800 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              YOUR DEVELOPER WORKSPACE
            </div>

            <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
              Your code.
              <br />
              Your knowledge.
              <br />
              <span className="text-emerald-600">One smart vault.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#64756c] sm:text-lg">
              Stop rewriting code you have already solved. Save your best
              snippets, organize them with AI-powered summaries and tags, and
              find useful solutions whenever you need them.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 hover:bg-emerald-700"
              >
                Create your free account
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-[#d5e0d9] bg-white px-6 py-3.5 text-sm font-semibold text-[#34473c] hover:border-emerald-300 hover:bg-emerald-50/50"
              >
                I already have an account
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#64756c]">
              <span className="inline-flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  ✓
                </span>
                Personal snippet library
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  ✓
                </span>
                AI-generated metadata
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rounded-[32px] bg-emerald-200/30 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-[#294239] bg-[#14231f] shadow-2xl shadow-emerald-950/15">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-300" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-medium text-white/55">
                  snippet-vault / Python
                </span>
                <span className="rounded-md bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-300">
                  SAVED
                </span>
              </div>

              <div className="px-5 pt-6 sm:px-7">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-300/80">
                  CODE SNIPPET
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  Python Even Numbers
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Filter a list to return only the even numbers.
                </p>
              </div>

              <div className="mx-4 mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#101b17] sm:mx-6">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <span className="text-xs text-white/45">even_numbers.py</span>
                  <span className="ml-auto text-xs text-white/35">Python</span>
                </div>
                <div className="overflow-x-auto px-4 py-5 font-mono text-xs leading-7 sm:px-5 sm:text-sm">
                  {sampleCode.map((line) => (
                    <div key={line.number} className="flex min-w-max gap-5">
                      <span className="select-none text-white/25">
                        {line.number}
                      </span>
                      <span className={line.color}>{line.code || "\u00a0"}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-5 pb-6 pt-5 sm:px-7">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10 text-sm text-emerald-300">
                    ✦
                  </span>
                  <span className="text-sm font-semibold text-white">
                    AI-generated tags
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["python", "lists", "filtering", "beginner-friendly"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-200"
                      >
                        #{tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="relative mt-4 flex items-center gap-3 rounded-2xl border border-[#e0e8e3] bg-white p-4 shadow-lg shadow-emerald-950/5 sm:absolute sm:-bottom-7 sm:-left-8 sm:mt-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-700">
                ✦
              </span>
              <div>
                <p className="text-sm font-semibold">Less searching, more building</p>
                <p className="mt-1 text-xs text-[#64756c]">
                  Keep your best solutions close at hand.
                </p>
              </div>
              <span className="ml-auto text-lg text-emerald-600">↗</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e0e8e3] bg-white/75">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              MADE FOR YOUR WORKFLOW
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              A smarter way to keep your code
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#64756c] sm:text-base">
              Turn scattered code examples into a personal library you can
              build on, project after project.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="group rounded-2xl border border-[#e0e8e3] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-950/5 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 font-mono text-lg font-semibold text-emerald-700 group-hover:bg-emerald-100">
                    {feature.icon}
                  </span>
                  <span className="text-sm font-semibold text-[#b0bdb5]">
                    {feature.number}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#64756c]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-[#14231f] px-6 py-10 text-center text-white sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              START BUILDING YOUR LIBRARY
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              Your next great solution deserves to be saved.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/60">
              Create your account and start collecting the code you will want
              to use again.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-white hover:bg-emerald-400"
            >
              Get started today <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#14231f] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold">
              {"</>"}
            </span>
            <span className="text-sm font-semibold">Snippet Vault</span>
          </Link>
          <p className="text-xs leading-5 text-white/50">
            A personal home for the code you want to keep.
          </p>
          <div className="flex gap-5 text-sm text-white/70">
            <Link href="/login" className="hover:text-emerald-300">
              Log in
            </Link>
            <Link href="/signup" className="hover:text-emerald-300">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
