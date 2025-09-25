import { prisma } from "@/lib/db";
import { NoUserError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const pageParam = request.nextUrl.searchParams.get("page");
  const searchParam = request.nextUrl.searchParams.get("search") || "";

  const page = Math.max(1, Number(pageParam) || 1);
  const itemsNumber = 10;
  const itemsToSkip = itemsNumber * (page - 1);

  try {
    const { userId } = await auth();
    if (!userId) {
      NoUserError();
      return NextResponse.json(
        { status: "error", message: "User not authenticated" },
        { status: 401 }
      );
    }

    const whereClause = {
      isPublic: true,
      ...(searchParam
        ? {
            OR: [
              {
                title: {
                  contains: searchParam,
                  mode: "insensitive" as const,
                },
              },
              {
                description: {
                  contains: searchParam,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const roadmapsCount = await prisma.roadmap.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(roadmapsCount / itemsNumber);

    if (page > totalPages && totalPages > 0) {
      return NextResponse.json(
        {
          status: "error",
          message: `Page ${page} exceeds total pages (${totalPages})`,
        },
        { status: 400 }
      );
    }

    const roadmaps = await prisma.roadmap.findMany({
      take: itemsNumber,
      skip: itemsToSkip,
      select: {
        _count: {
          select: {
            entries: true,
            comments: true,
            likes: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullname: true,
            username: true,
            photo: true,
          },
        },
        id: true,
        description: true,
        image: true,
        title: true,
        createdAt: true,
      },
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    const hasNextPage = totalPages > page;

    return NextResponse.json(
      {
        status: "success",
        currentPage: page,
        hasNextPage,
        totalPages,
        data: roadmaps,
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
