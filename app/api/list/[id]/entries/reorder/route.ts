import { NoUserError } from "@/lib/utils";
import { listService } from "@/services/list.service";
import { ReorderRequest } from "@/types/Roadmap";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      NoUserError();
      return;
    }

    const { id: listId } = await params;
    if (!listId) {
      return NextResponse.json(
        { status: "error", message: "missing list id" },
        { status: 401 }
      );
    }

    const body: ReorderRequest = await request.json();

    listService.reOrderListItems({ reOrderRequest: body, listId, userId });

    return NextResponse.json(
      { status: "success", message: "Items reordered successfully" },
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
