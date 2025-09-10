import { prisma } from "@/lib/db";
import { NoUserError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ thoughtId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) NoUserError();

    const { thoughtId } = await params;
    if (!thoughtId) {
      return NextResponse.json(
        { status: "error", message: "comicId or thoughtId missing" },
        { status: 401 }
      );
    }

    const data = await prisma.post.findFirst({
      where: {
        id: thoughtId,
      },
      select: {
        id: true,
        content: true,
        attachments: true,
        hasSpoiler: true,
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

        _count: {
          select: {
            bookmarks: true,
            likes: true,
            comments: true,
          },
        },
      },
    });

    const thought = data
      ? {
          ...data,
          // Only check if logged in user has liked/bookmarked
          isLikedByCurrentUser: userId ? (data.likes?.length || 0) > 0 : false,
        }
      : data;

    return NextResponse.json(
      { status: "success", data: thought },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating thought:", error);
    return NextResponse.json(
      { status: "error", message: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
