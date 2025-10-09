import { NoUserError } from "@/lib/utils";
import { listService } from "@/services/list.service";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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
        { status: "error", message: "Missing List ID" },
        { status: 401 }
      );
    }

    const { title, image } = await request.json();

    listService.addItemToList({ listId, title, image, userId });

    return NextResponse.json(
      {
        status: "success",
        message: "Item added to the list",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
