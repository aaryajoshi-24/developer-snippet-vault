
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please log in to view analytics." },
        { status: 401 }
      );
    }

    // Fetch the user's snippets
    const { data: snippets, error: snippetsError } = await supabase
      .from("snippets")
      .select("id, title, content, language, created_at")
      .eq("user_id", user.id);

    if (snippetsError) {
      console.error("Analytics snippets query failed:", snippetsError);

      return NextResponse.json(
        {
          error: "Unable to load snippet analytics.",
          details: snippetsError.message,
          code: snippetsError.code,
        },
        { status: 500 }
      );
    }

    // Fetch favorites and collections
    const { data: organizations, error: organizationsError } =
      await supabase
        .from("snippet_organization")
        .select("snippet_id, is_favorite, collection_name")
        .eq("user_id", user.id);

    if (organizationsError) {
      console.error(
        "Analytics organization query failed:",
        organizationsError
      );

      return NextResponse.json(
        {
          error: "Unable to load favorites and collection analytics.",
          details: organizationsError.message,
          code: organizationsError.code,
        },
        { status: 500 }
      );
    }

    const allSnippets = snippets ?? [];
    const allOrganizations = organizations ?? [];

    // Count snippets by programming language
    const languageCounts: Record<string, number> = {};

    for (const snippet of allSnippets) {
      const language = snippet.language?.trim() || "Unknown";

      languageCounts[language] =
        (languageCounts[language] ?? 0) + 1;
    }

    const languages = Object.entries(languageCounts)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count);

    const snippetIdSet = new Set(allSnippets.map((item) => item.id));
    const activeOrganizations = allOrganizations.filter((item) =>
      snippetIdSet.has(item.snippet_id)
    );

    // Count favorites
    const favoritesCount = activeOrganizations.filter(
      (item) => item.is_favorite
    ).length;

    // Build actual favorite code snippets
    const favoriteOrgMap = new Map(
      activeOrganizations
        .filter((item) => item.is_favorite)
        .map((item) => [item.snippet_id, item])
    );

    const favoriteSnippets = allSnippets
      .filter((snippet) => favoriteOrgMap.has(snippet.id))
      .map((snippet) => {
        const org = favoriteOrgMap.get(snippet.id);
        return {
          id: snippet.id,
          title: snippet.title || "Untitled Snippet",
          language: snippet.language || "text",
          content: snippet.content || "",
          collectionName: org?.collection_name ?? null,
          created_at: snippet.created_at,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );

    // Count unique collections
    const collectionsCount = new Set(
      activeOrganizations
        .map((item) => item.collection_name?.trim())
        .filter((name): name is string => Boolean(name))
    ).size;

    // Get the five most recently created snippets
    const recentSnippets = [...allSnippets]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      )
      .slice(0, 5)
      .map((snippet) => ({
        id: snippet.id,
        title: snippet.title || "Untitled Snippet",
        language: snippet.language || "text",
        created_at: snippet.created_at,
      }));

    return NextResponse.json({
      totalSnippets: allSnippets.length,
      totalLanguages: languages.length,
      favoritesCount,
      collectionsCount,
      languages,
      recentSnippets,
      favoriteSnippets,
    });
  } catch (error) {
    console.error("Analytics API failed:", error);

    return NextResponse.json(
      { error: "Unable to generate analytics." },
      { status: 500 }
    );
  }
}
