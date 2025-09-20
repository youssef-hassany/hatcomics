import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import paginator from "@/lib/pagination";

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page");

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { status: "error", message: "User not authenticated or doesn't exist" },
        { status: 401 }
      );
    }

    const posts = await prisma.post.findMany({
      where: {
        AND: [{ isDraft: false }, { comicId: { not: null } }],
      },
      select: {
        id: true,
        content: true,
        user: {
          select: {
            id: true,
            fullname: true,
            username: true,
            photo: true,
          },
        },
        comic: {
          select: {
            image: true,
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const { paginatedData, hasNextPage, currentPage, totalPages } = paginator(
      posts,
      page
    );

    return NextResponse.json(
      {
        status: "success",
        data: paginatedData,
        hasNextPage,
        currentPage,
        totalPages,
      },
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
