
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function errorResponse(
  message: string,
  status = 500,
  details?: unknown,
  code?: string
) {
  return NextResponse.json(
    {
      error: message,
      ...(details ? { details } : {}),
      ...(code ? { code } : {}),
    },
    { status }
  );
}

function isValidUUID(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse("Please log in first.", 401);
    }

    const { searchParams } = new URL(request.url);
    const snippetId = searchParams.get("snippetId");

    let query = supabase
      .from("snippet_organization")
      .select("id, snippet_id, is_favorite, collection_name")
      .eq("user_id", user.id);

    if (snippetId) {
      query = query.eq("snippet_id", snippetId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Organization GET database error:", error);
      return errorResponse(
        "Unable to load favorites and collections.",
        500,
        error.message,
        error.code
      );
    }

    const organizations = data ?? [];

    return NextResponse.json({
      organizations,
      organization: organizations[0] ?? null,
    });
  } catch (error) {
    console.error("Organization GET failed:", error);
    return errorResponse("Unable to load organization data.");
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse("Please log in first.", 401);
    }

    let body: {
      snippetId?: unknown;
      isFavorite?: unknown;
      collectionName?: unknown;
    };

    try {
      body = await request.json();
    } catch {
      return errorResponse("Request body must be valid JSON.", 400);
    }

    const { snippetId, isFavorite, collectionName } = body;

    if (!isValidUUID(snippetId)) {
      return errorResponse("A valid snippet ID is required.", 400);
    }

    if (typeof isFavorite !== "boolean") {
      return errorResponse("Favorite must be true or false.", 400);
    }

    if (
      collectionName !== undefined &&
      collectionName !== null &&
      (typeof collectionName !== "string" ||
        collectionName.length > 80)
    ) {
      return errorResponse(
        "Collection name must be 80 characters or fewer.",
        400
      );
    }

    const { data: snippet, error: snippetError } = await supabase
      .from("snippets")
      .select("id")
      .eq("id", snippetId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (snippetError) {
      console.error("Snippet ownership check failed:", snippetError);
      return errorResponse(
        "Unable to verify snippet ownership.",
        500,
        snippetError.message
      );
    }

    if (!snippet) {
      return errorResponse("Snippet not found.", 404);
    }

    const normalizedCollection =
      typeof collectionName === "string"
        ? collectionName.trim() || null
        : null;

    // Check if an organization record already exists for this snippet and user
    const { data: existing, error: existingError } = await supabase
      .from("snippet_organization")
      .select("id")
      .eq("user_id", user.id)
      .eq("snippet_id", snippetId)
      .maybeSingle();

    if (existingError) {
      console.error("Organization check failed:", existingError);
      return errorResponse(
        "Unable to check existing organization.",
        500,
        existingError.message,
        existingError.code
      );
    }

    let savedData;
    let saveError;

    if (existing) {
      const updateResult = await supabase
        .from("snippet_organization")
        .update({
          is_favorite: isFavorite,
          collection_name: normalizedCollection,
        })
        .eq("id", existing.id)
        .eq("user_id", user.id)
        .select("id, snippet_id, is_favorite, collection_name")
        .single();

      savedData = updateResult.data;
      saveError = updateResult.error;
    } else {
      const insertResult = await supabase
        .from("snippet_organization")
        .insert({
          user_id: user.id,
          snippet_id: snippetId,
          is_favorite: isFavorite,
          collection_name: normalizedCollection,
        })
        .select("id, snippet_id, is_favorite, collection_name")
        .single();

      savedData = insertResult.data;
      saveError = insertResult.error;
    }

    if (saveError) {
      console.error("Organization save failed:", saveError);
      return errorResponse(
        "Unable to save favorites and collections.",
        500,
        saveError.message,
        saveError.code
      );
    }

    return NextResponse.json({ organization: savedData });
  } catch (error) {
    console.error("Organization POST failed:", error);
    return errorResponse("Unable to update snippet organization.");
  }
}
