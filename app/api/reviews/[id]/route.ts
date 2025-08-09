import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { status: "error", message: "User not authenticated or doesn't exist" },
        { status: 401 }
      );
    }

    // Get the review before deleting to access its rating and comicId
    const reviewToDelete = await prisma.review.findFirst({
      where: { id },
      include: {
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
    });

    if (!reviewToDelete) {
      return NextResponse.json(
        { status: "error", message: "Review not found" },
        { status: 404 }
      );
    }

    // Check if the user is the owner of the review
    const currentUser = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!currentUser || currentUser.id !== reviewToDelete.userId) {
      return NextResponse.json(
        { status: "error", message: "You can only delete your own reviews" },
        { status: 403 }
      );
    }

    // Delete the review
    await prisma.review.delete({
      where: { id },
    });

    // Get the comic to update its stats
    const comic = await prisma.comic.findFirst({
      where: { id: reviewToDelete.comicId },
    });

    if (comic) {
      const currentAvgRate = comic.averageRating || 0;
      const currentReviewsNum = comic.totalReviews || 0;

      // Calculate new stats after removing the review
      const newReviewsNum = Math.max(0, currentReviewsNum - 1);
      let newAvgRate = 0;

      if (newReviewsNum > 0) {
        // Reverse the average calculation: (oldAvg * oldCount - deletedRating) / newCount
        newAvgRate =
          (currentAvgRate * currentReviewsNum - reviewToDelete.rating) /
          newReviewsNum;
      }

      // Update comic stats
      await prisma.comic.update({
        data: {
          averageRating: newAvgRate,
          totalReviews: newReviewsNum,
        },
        where: {
          id: reviewToDelete.comicId,
        },
      });
    }

    // Deduct points from the user
    if (currentUser) {
      await prisma.user.update({
        data: {
          points: Math.max(0, (currentUser.points || 0) - 2),
        },
        where: {
          clerkId: userId,
        },
      });
    }

    return NextResponse.json(
      { status: "success", message: "Review deleted successfully" },
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
