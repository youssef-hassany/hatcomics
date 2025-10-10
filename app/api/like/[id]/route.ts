import { NoUserError } from "@/lib/utils";
import { likeService } from "@/services/like.service";
import { notificationService } from "@/services/notification.service";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contentId } = await params;
    const { userId } = await auth();

    if (!userId) {
      NoUserError();
      return;
    }

    const { contentType } = await request.json();

    await likeService.addLike({ contentId, contentType, userId });

    await notificationService.createLikeNotification(
      userId,
      userId,
      contentType.toString().toUpperCase(),
      contentId,
      contentType === "thought"
        ? `/book-club/${contentId}`
        : `/${contentType}s/${contentId}`
    );

    return NextResponse.json(
      { status: "success", message: "Like added" },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contentId } = await params;
    const { userId } = await auth();

    if (!userId) {
      NoUserError();
      return;
    }

    const { contentType } = await request.json();

    await likeService.removeLike({ contentId, contentType, userId });

    return NextResponse.json(
      { status: "success", message: "Like removed" },
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
