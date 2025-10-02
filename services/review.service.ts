import { prisma } from "@/lib/db";
import { comicService } from "./comic.service";

class ReviewService {
  async deleteUserReviews(userId: string) {
    // get user reviews
    const userReviews = await prisma.review.findMany({
      where: {
        userId,
      },
      include: {
        comic: {
          select: {
            id: true,
            averageRating: true,
            totalReviews: true,
          },
        },
      },
    });

    // recalculate comic average score after removing user reviews
    await Promise.all(
      userReviews.map((review) =>
        comicService.reCalculateComicAverageRatingOnDelete({
          comicId: review.comicId,
          currentAvgRate: review.comic.averageRating || 0,
          currentReviewsNum: review.comic.totalReviews,
          reviewToDeleteRating: review.rating,
        })
      )
    );

    // delete user reviews
    await prisma.review.deleteMany({
      where: {
        userId,
      },
    });
  }
}

export const reviewService = new ReviewService();
