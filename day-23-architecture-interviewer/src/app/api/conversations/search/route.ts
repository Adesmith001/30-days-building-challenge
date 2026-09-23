import {
  requireUser,
} from "@/lib/supabase/auth";

export async function GET(
  request: Request,
) {
  const {
    supabase,
  } =
    await requireUser();

  const url =
    new URL(request.url);

  const query =
    url.searchParams
      .get("q")
      ?.trim();

  if (!query) {
    return Response.json({
      conversations: [],
    });
  }

  const { data, error } =
    await supabase.rpc(
      "search_user_conversations",
      {
        search_query:
          query.slice(
            0,
            100,
          ),
      },
    );

  if (error) {
    return Response.json(
      {
        error:
          "Search failed.",
      },
      {
        status: 500,
      },
    );
  }

  return Response.json({
    conversations:
      data ?? [],
  });
}
