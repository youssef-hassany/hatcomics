import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const user = await prisma.user.findFirst({ where: { clerkId: userId! } });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User is not authorized!" },
        { status: 401 }
      );
    }

    const { id: commentId } = await params;

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { status: "error", message: "Comment not found!" },
        { status: 404 }
      );
    }

    // Check if user already liked this comment
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: user.id,
        commentId: commentId,
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { status: "error", message: "Comment already liked!" },
        { status: 400 }
      );
    }

    // Create the like
    await prisma.like.create({
      data: {
        userId: user.id,
        commentId: commentId,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Comment liked successfully",
    });
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
    const { userId } = await auth();
    const user = await prisma.user.findFirst({ where: { clerkId: userId! } });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User is not authorized!" },
        { status: 401 }
      );
    }

    const { id: commentId } = await params;

    // Find and delete the like
    const like = await prisma.like.findFirst({
      where: {
        userId: user.id,
        commentId: commentId,
      },
    });

    if (!like) {
      return NextResponse.json(
        { status: "error", message: "Comment not liked!" },
        { status: 404 }
      );
    }

    await prisma.like.delete({
      where: { id: like.id },
    });

    return NextResponse.json({
      status: "success",
      message: "Comment unliked successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
