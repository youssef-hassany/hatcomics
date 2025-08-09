import { prisma } from "@/lib/db";
import { NoUserError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) NoUserError();

    const topPosts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
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
      orderBy: {
        likes: { _count: "desc" },
      },
      take: 5,
    });

    const posts = topPosts.map((post) => ({
      ...post,
      isLikedByCurrentUser: post.likes.length > 0,
      isBookmarked: post.bookmarks.length > 0,
    }));

    return NextResponse.json(
      { status: "success", data: posts },
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
