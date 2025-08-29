import { prisma } from "@/lib/db";
import { NoUserError } from "@/lib/utils";
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
        user: {
          select: {
            id: true,
            fullname: true,
            username: true,
            photo: true,
            points: true,
            role: true,
          },
        },
        title: true,
        createdAt: true,
        isDraft: true,
        // Only include likes/bookmarks filter if user is logged in
        ...(userId && {
          likes: {
            where: { userId },
            select: { userId: true },
          },
          bookmarks: {
            where: { userId },
            select: { userId: true },
          },
        }),
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
          // Only check if logged in user has liked/bookmarked
          isLikedByCurrentUser: userId ? (data.likes?.length || 0) > 0 : false,
          isBookmarked: userId ? (data.bookmarks?.length || 0) > 0 : false,
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
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) NoUserError();

    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });

    if (post?.userId !== userId) {
      return NextResponse.json(
        { status: "error", message: `Access denied` },
        { status: 403 }
      );
    }

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
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) NoUserError();

    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });

    if (post?.userId !== userId) {
      return NextResponse.json(
        { status: "error", message: `Access denied` },
        { status: 403 }
      );
    }

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
