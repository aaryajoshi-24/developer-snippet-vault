import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return createBrowserClient(
        "https://placeholder-project.supabase.co",
        "placeholder-anon-key"
      );
    }

    throw new Error(
      "Missing Supabase configuration: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be configured in environment variables."
    );
  }

  return createBrowserClient(url, key);
}