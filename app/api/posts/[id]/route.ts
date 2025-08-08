import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { userId } = await auth();

    const data = await prisma.post.findFirst({
      where: { id },
      select: {
        id: true,
        userId: true,
        content: true,
        user: true,
        title: true,
        createdAt: true,
        isDraft: true,
        likes: {
          where: { userId: userId! }, // Only get current user's like
          select: { userId: true },
        },
        bookmarks: {
          where: { userId: userId! }, // Only get current user's bookmark
          select: { userId: true },
        },
        _count: {
          select: {
            bookmarks: true,
            likes: true,
            comments: true,
          },
        },
      },
    });

    const post = data
      ? {
          ...data,
          isLikedByCurrentUser: data.likes.length > 0,
          isBookmarked: data.bookmarks.length > 0,
        }
      : data;

    return NextResponse.json(
      { status: "success", data: post },
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

    await prisma.post.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { status: "success", message: "Post Deleted Successfully" },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content, title, isDraft } = await request.json();

    const updatedPost = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        isDraft,
      },
    });

    return NextResponse.json(
      { status: "success", data: updatedPost },
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
