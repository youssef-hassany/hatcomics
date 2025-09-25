import { prisma } from "@/lib/db";
import { NoUserError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      NoUserError();
      return;
    }

    const roadmaps = await prisma.roadmap.findMany({
      where: {
        createdBy: userId,
      },
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
        isPublic: true,
      },
    });

    return NextResponse.json(
      { status: "success", data: roadmaps },
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
