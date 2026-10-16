
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  explainSnippetCode,
  findCodeBugs,
  improveSnippetCode,
  generateSnippetDocumentation,
  analyzeCodeComplexity,
} from "@/lib/gemini";

const ACTIONS = {
  explain: explainSnippetCode,
  bugs: findCodeBugs,
  improve: improveSnippetCode,
  documentation: generateSnippetDocumentation,
  complexity: analyzeCodeComplexity,
} as const;

type AssistantAction = keyof typeof ACTIONS;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please log in to use the AI Code Assistant." },
        { status: 401 }
      );
    }

    let body: {
      action?: unknown;
      language?: unknown;
      content?: unknown;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON." },
        { status: 400 }
      );
    }

    const { action, language, content } = body;

    if (
      typeof action !== "string" ||
      !Object.hasOwn(ACTIONS, action)
    ) {
      return NextResponse.json(
        { error: "Choose a valid AI assistant action." },
        { status: 400 }
      );
    }

    if (
      typeof language !== "string" ||
      typeof content !== "string" ||
      !language.trim() ||
      !content.trim()
    ) {
      return NextResponse.json(
        { error: "Language and code content are required." },
        { status: 400 }
      );
    }

    if (language.length > 50 || content.length > 50000) {
      return NextResponse.json(
        { error: "The language or code exceeds the allowed length." },
        { status: 400 }
      );
    }

    const assistant = ACTIONS[action as AssistantAction];
    const result = await assistant(language.trim(), content);

    return NextResponse.json({
      action,
      result,
    });
  } catch (error) {
    console.error("AI assistant request failed:", error);

    return NextResponse.json(
      {
        error:
          "The AI assistant is temporarily unavailable. Please try again.",
      },
      { status: 503 }
    );
  }
}
