
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSnippetMetadata } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please log in to generate AI metadata." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, language, content } = body;

    if (
      typeof title !== "string" ||
      typeof language !== "string" ||
      typeof content !== "string" ||
      !title.trim() ||
      !language.trim() ||
      !content.trim()
    ) {
      return NextResponse.json(
        { error: "Title, language, and code content are required." },
        { status: 400 }
      );
    }

    if (
      title.length > 150 ||
      content.length > 50000 ||
      language.length > 50
    ) {
      return NextResponse.json(
        { error: "One or more fields exceed the allowed length." },
        { status: 400 }
      );
    }

    try {
      const metadata = await generateSnippetMetadata(
        title.trim(),
        language.trim(),
        content
      );

      return NextResponse.json({
        ...metadata,
        aiGenerated: true,
      });
    } catch (error) {
      console.error("Gemini metadata generation failed:", error);

      return NextResponse.json(
        {
          error:
            "AI metadata is temporarily unavailable. Please try again.",
          code: "AI_METADATA_UNAVAILABLE",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Metadata API request failed:", error);

    return NextResponse.json(
      { error: "Unable to process the metadata request." },
      { status: 500 }
    );
  }
}
