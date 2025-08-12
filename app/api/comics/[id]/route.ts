import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { Comic } from "@prisma/client"; // Assuming you have this type

// Define the response type
type ComicWithReviewStatus = Comic & {
  isReviewed?: boolean;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

    const comic = await prisma.comic.findFirst({
      where: { id },
    });

    if (!comic) {
      return NextResponse.json(
        { status: "error", message: "Comic not found" },
        { status: 404 }
      );
    }

    let comicWithReviewStatus: ComicWithReviewStatus = comic;

    // Only check for review if user is authenticated
    if (userId) {
      const review = await prisma.review.findFirst({
        where: {
          comicId: comic.id,
          userId: userId,
        },
      });

      comicWithReviewStatus = {
        ...comic,
        isReviewed: !!review,
      };
    }

    return NextResponse.json(
      { status: "success", data: comicWithReviewStatus },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching comic:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
