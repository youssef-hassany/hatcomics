import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
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
      take: 3,
    });

    return NextResponse.json(
      {
        status: "success",
        data: posts,
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
