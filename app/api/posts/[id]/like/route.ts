import { prisma } from "@/lib/db";
import { NoUserError } from "@/lib/utils";
import { notificationService } from "@/services/notification.service";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
      NoUserError();
      return;
    }

    await prisma.like.create({
      data: {
        postId: id,
        userId: userId!,
      },
    });

    const post = await prisma.post.findFirst({
      where: {
        id,
      },
    });

    if (post && post.userId !== userId) {
      await notificationService.createLikeNotification(
        post.userId,
        userId,
        "POST",
        post.id,
        post.comicId ? `/book-club/${post.id}` : `/posts/${post.id}`
      );
    }

    return NextResponse.json(
      { status: "success", message: "Like added to post" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
      NoUserError();
    }

    await prisma.like.delete({
      where: {
        userId_postId: {
          postId: id,
          userId: userId!,
        },
      },
    });

    return NextResponse.json(
      { status: "success", message: "Like removed from post" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
