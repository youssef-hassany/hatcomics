import { prisma } from "@/lib/db";
import { NoUserError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const { userId } = await auth();
    if (!userId) {
      NoUserError();
    }

    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    const userPosts = await prisma.post.findMany({
      where: {
        userId: user?.id,
      },
      select: {
        id: true,
        title: true,
        user: true,
        likes: true,
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      { status: "success", data: userPosts },
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
