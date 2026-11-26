import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();

    const { id } = await params;

    const data = await prisma.review.findMany({
      where: { comicId: id },
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
            badges: {
              select: {
                isApplied: true,
                badgeDefinition: {
                  select: {
                    title: true,
                    url: true,
                  },
                },
              },
            },
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
    });

    const reviews = data.map((review: any) => ({
      ...review,
      isLikedByCurrentUser: review.likes.length > 0,
    }));

    return NextResponse.json(
      { status: "success", data: reviews },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 },
    );
  }
}
