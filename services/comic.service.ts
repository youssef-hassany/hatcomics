import { prisma } from "@/lib/db";

class ComicService {
  async reCalculateComicAverageRatingOnDelete(properties: {
    currentAvgRate: number;
    currentReviewsNum: number;
    comicId: string;
    reviewToDeleteRating: number;
  }) {
    const { currentAvgRate, comicId, currentReviewsNum, reviewToDeleteRating } =
      properties;

    if (currentReviewsNum === 0) {
      return;
    }

    // Calculate new stats after removing the review
    const newReviewsNum = Math.max(0, currentReviewsNum - 1);
    let newAvgRate = 0;

    if (newReviewsNum > 0) {
      // Reverse the average calculation: (oldAvg * oldCount - deletedRating) / newCount
      newAvgRate =
        (currentAvgRate * currentReviewsNum - reviewToDeleteRating) /
        newReviewsNum;
    }

    await prisma.comic.update({
      where: {
        id: comicId,
      },
      data: {
        averageRating: newAvgRate,
        totalReviews: newReviewsNum,
      },
    });
  }
}

export const comicService = new ComicService();
