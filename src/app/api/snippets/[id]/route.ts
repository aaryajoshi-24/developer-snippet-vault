
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

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

    if (
      typeof id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    ) {
      return NextResponse.json(
        { error: "Invalid snippet ID." },
        { status: 400 }
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
