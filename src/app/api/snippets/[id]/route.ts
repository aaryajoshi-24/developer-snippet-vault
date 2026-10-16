
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isValidId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id
  );
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { error: "Invalid snippet ID." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please log in to update a snippet." },
        { status: 401 }
      );
    }

    let body: {
      title?: unknown;
      content?: unknown;
      language?: unknown;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON." },
        { status: 400 }
      );
    }

    const { title, content, language } = body;

    if (
      typeof title !== "string" ||
      typeof content !== "string" ||
      typeof language !== "string" ||
      !title.trim() ||
      !content.trim() ||
      !language.trim()
    ) {
      return NextResponse.json(
        { error: "Title, content, and language are required." },
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

    const { data, error } = await supabase
      .from("snippets")
      .update({
        title: title.trim(),
        content,
        language: language.trim(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id, title, content, language")
      .maybeSingle();

    if (error) {
      console.error("Snippet update failed:", error);
      return NextResponse.json(
        { error: "Unable to update the snippet." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Snippet not found or you don't have access to it." },
        { status: 404 }
      );
    }

    return NextResponse.json({ snippet: data });
  } catch (error) {
    console.error("Snippet PATCH failed:", error);

    return NextResponse.json(
      { error: "Unable to update the snippet." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { error: "Invalid snippet ID." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please log in to delete a snippet." },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("snippets")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Snippet deletion failed:", error);
      return NextResponse.json(
        { error: "Unable to delete the snippet." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Snippet not found or you don't have access to it." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete API failed:", error);

    return NextResponse.json(
      { error: "Something went wrong while deleting the snippet." },
      { status: 500 }
    );
  }
}
