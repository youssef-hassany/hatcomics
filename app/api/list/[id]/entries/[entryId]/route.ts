import { NoUserError } from "@/lib/utils";
import { listService } from "@/services/list.service";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      NoUserError();
      return;
    }

    const { id: listId, entryId } = await params;
    if (!listId || !entryId) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing Required fields: listId or entryId",
        },
        { status: 401 }
      );
    }

    const { title, image } = await request.json();

    listService.updateItem({ itemId: entryId, image, title, listId, userId });

    return NextResponse.json(
      { status: "Success", message: "Item updated successfully" },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      NoUserError();
      return;
    }

    const { id: listId, entryId } = await params;
    if (!listId || !entryId) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing Required fields: listId or entryId",
        },
        { status: 401 }
      );
    }

    listService.removeItemFromList({ itemId: entryId, listId, userId });

    return NextResponse.json(
      { status: "Success", message: "Item Deleted Successfully" },
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
