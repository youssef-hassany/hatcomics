import { prisma } from "@/lib/db";
import paginate from "@/lib/pagination";
import { NoUserError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page");

  try {
    const { userId } = await auth();

    if (!userId) NoUserError();

    const data = await prisma.bookmark.findMany({
      where: {
        userId: userId!,
      },
      include: {
        post: {
          include: {
            _count: true,
            likes: true,
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
          },
        },
      },
    });

    const { paginatedData, hasNextPage, currentPage, totalPages } = paginate(
      data,
      page
    );

    const bookmarks = paginatedData.map((item) => ({
      ...item,
      isBookmarked: true,
      isLikedByCurrentUser: item.post.likes.some(
        (like) => like.userId === userId
      ),
    }));

    return NextResponse.json(
      {
        status: "success",
        data: bookmarks,
        hasNextPage,
        currentPage,
        totalPages,
      },
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
