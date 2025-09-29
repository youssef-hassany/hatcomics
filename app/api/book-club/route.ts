import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import paginate from "@/lib/pagination";

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

    const posts = await paginate({
      model: "post",
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
        hasSpoiler: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      page: Number(page),
    });

    return NextResponse.json(
      {
        status: "success",
        data: posts.data,
        hasNextPage: posts.meta.hasNextPage,
        currentPage: posts.meta.currentPage,
        totalPages: posts.meta.totalPages,
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
