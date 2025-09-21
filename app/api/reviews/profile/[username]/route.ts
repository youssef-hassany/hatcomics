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

    const data = await prisma.review.findMany({
      where: {
        userId: user?.id,
      },
      include: {
        comic: true,
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
        ...(userId && {
          likes: {
            where: { userId },
            select: { userId: true },
          },
        }),
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const userReviews = data.map((review) => ({
      ...review,
      isLikedByCurrentUser: review.likes.length > 0,
    }));

    return NextResponse.json(
      { status: "success", data: userReviews },
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
