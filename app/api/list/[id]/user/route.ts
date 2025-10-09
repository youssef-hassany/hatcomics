import { listService } from "@/services/list.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const pageParam = request.nextUrl.searchParams.get("page");
  const page = Math.max(1, Number(pageParam) || 1);

  try {
    const { id: userId } = await params;
    if (!userId) {
      return NextResponse.json(
        { status: "error", message: "Missing User ID" },
        { status: 401 }
      );
    }

    const { data, meta } = await listService.getUserLists(userId, page);
    const { hasNextPage, totalPages } = meta;

    return NextResponse.json(
      {
        status: "success",
        currentPage: page,
        hasNextPage,
        totalPages,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
