import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Comic } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface UserPreferences {
  characters: Map<string, { score: number; count: number }>;
  publishers: Map<string, { score: number; count: number }>;
  authors: Map<string, { score: number; count: number }>;
  isIndie: { score: number; count: number; totalRatings: number };
}

interface ScoredComic {
  comic: Comic; // Your Comic type from Prisma
  score: number;
  matchReasons: string[];
}

/**
 * Build user preference profile from their positive reviews (3.5-5 stars)
 */
function buildUserPreferences(reviews: any[]): UserPreferences {
  const preferences: UserPreferences = {
    characters: new Map(),
    publishers: new Map(),
    authors: new Map(),
    isIndie: { score: 0, count: 0, totalRatings: 0 },
  };

  reviews.forEach((review) => {
    const { rating, comic } = review;

    // Normalize rating to 0-1 scale (3.5 → 0, 5.0 → 1.0)
    const normalizedScore = (rating - 3.5) / 1.5;

    // Track characters
    comic.characters?.forEach((character: string) => {
      const current = preferences.characters.get(character) || {
        score: 0,
        count: 0,
      };
      preferences.characters.set(character, {
        score: current.score + normalizedScore,
        count: current.count + 1,
      });
    });

    // Track authors
    comic.authors?.forEach((author: string) => {
      const current = preferences.authors.get(author) || { score: 0, count: 0 };
      preferences.authors.set(author, {
        score: current.score + normalizedScore,
        count: current.count + 1,
      });
    });

    // Track publisher
    if (comic.publisher) {
      const current = preferences.publishers.get(comic.publisher) || {
        score: 0,
        count: 0,
      };
      preferences.publishers.set(comic.publisher, {
        score: current.score + normalizedScore,
        count: current.count + 1,
      });
    }

    // Track indie preference
    preferences.isIndie.score += comic.isIndie ? normalizedScore : 0;
    preferences.isIndie.count += comic.isIndie ? 1 : 0;
    preferences.isIndie.totalRatings += 1;
  });

  return preferences;
}

/**
 * Calculate recommendation score for a comic based on user preferences
 */
function scoreComic(
  comic: any,
  preferences: UserPreferences,
  userReviewCount: number
): { score: number; reasons: string[] } {
  let score = 0;
  let totalWeight = 0;
  const matchReasons: string[] = [];

  // 1. Characters (highest weight = 3)
  let characterScore = 0;
  let characterWeight = 0;
  comic.characters?.forEach((character: string) => {
    if (preferences.characters.has(character)) {
      const pref = preferences.characters.get(character)!;
      const avgScore = pref.score / pref.count;
      characterScore += avgScore * 3;
      characterWeight += 3;

      if (avgScore > 0.6) {
        matchReasons.push(`Features ${character}`);
      }
    }
  });
  score += characterScore;
  totalWeight += characterWeight;

  // 2. Authors (medium-high weight = 2)
  let authorScore = 0;
  let authorWeight = 0;
  comic.authors?.forEach((author: string) => {
    if (preferences.authors.has(author)) {
      const pref = preferences.authors.get(author)!;
      const avgScore = pref.score / pref.count;
      authorScore += avgScore * 2;
      authorWeight += 2;

      if (avgScore > 0.6) {
        matchReasons.push(`By ${author}`);
      }
    }
  });
  score += authorScore;
  totalWeight += authorWeight;

  // 3. Publisher (lower weight = 1)
  if (comic.publisher && preferences.publishers.has(comic.publisher)) {
    const pref = preferences.publishers.get(comic.publisher)!;
    const avgScore = pref.score / pref.count;
    score += avgScore * 1;
    totalWeight += 1;

    if (avgScore > 0.6) {
      matchReasons.push(`${comic.publisher} publisher`);
    }
  }

  // 4. Genre preference (indie vs superhero) - weight = 1.5
  if (preferences.isIndie.totalRatings > 0) {
    const indiePreference =
      preferences.isIndie.score / preferences.isIndie.totalRatings;

    // If user likes indie (>0.5) and comic is indie, boost
    // If user likes superhero (<0.5) and comic is not indie, boost
    if (
      (indiePreference > 0.5 && comic.isIndie) ||
      (indiePreference <= 0.5 && !comic.isIndie)
    ) {
      score += indiePreference * 1.5;
      totalWeight += 1.5;

      if (comic.isIndie && indiePreference > 0.6) {
        matchReasons.push("Indie comic");
      } else if (!comic.isIndie && indiePreference <= 0.4) {
        matchReasons.push("Superhero comic");
      }
    }
  }

  // Normalize score to 0-1 range
  let normalizedScore = totalWeight > 0 ? score / totalWeight : 0;

  // 5. Apply bonus multipliers

  // Boost beginner-friendly for new users
  if (userReviewCount < 10 && comic.isBeginnerFriendly) {
    normalizedScore *= 1.15;
    matchReasons.push("Beginner-friendly");
  }

  // Boost highly-rated comics
  if (
    comic.averageRating &&
    comic.averageRating >= 4.5 &&
    comic.totalReviews >= 10
  ) {
    normalizedScore *= 1.1;
    matchReasons.push(`Highly rated (${comic.averageRating.toFixed(1)}⭐)`);
  }

  // Small penalty for very long series (might be intimidating)
  if (comic.numberOfIssues > 50) {
    normalizedScore *= 0.95;
  }

  // Boost ongoing series slightly (fresh content)
  if (comic.ongoing) {
    normalizedScore *= 1.05;
  }

  return { score: normalizedScore, reasons: matchReasons };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { userId } = await auth();
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    console.log(limit);

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // 1. Get user's positive reviews (3.5-5 stars)
    const userReviews = await prisma.review.findMany({
      where: {
        userId: userId,
        rating: {
          gte: 3.5,
        },
      },
      include: {
        comic: true,
      },
      orderBy: {
        createdAt: "desc", // More recent reviews can be weighted more if needed
      },
    });

    // console.log(userReviews);

    // Handle cold start - user has no positive reviews
    if (userReviews.length === 0) {
      // Fallback: return popular beginner-friendly comics
      const popularComics = await prisma.comic.findMany({
        where: {
          averageRating: {
            not: null,
          },
        },
        orderBy: [
          {
            averageRating: "desc",
          },
          {
            totalReviews: "desc",
          },
        ],
        take: 10,
      });

      //   console.log(popularComics);

      return NextResponse.json({
        recommendations: popularComics.map((comic) => ({
          ...comic,
          recommendationScore: 0,
          matchReasons: ["Popular beginner-friendly comic"],
          isColdStart: true,
        })),
        totalReviews: 0,
        message:
          "Showing popular beginner-friendly comics (no user reviews yet)",
      });
    }

    // 2. Build user preference profile
    const preferences = buildUserPreferences(userReviews);

    // 3. Get comics user hasn't reviewed
    const reviewedComicIds = userReviews.map((review) => review.comicId);

    const candidateComics = await prisma.comic.findMany({
      where: {
        id: {
          notIn: reviewedComicIds,
        },
        // totalReviews: {
        //   gte: 3, // Minimum reviews for reliability
        // },
      },
    });

    // 4. Score all candidate comics
    const scoredComics: ScoredComic[] = candidateComics
      .map((comic) => {
        const { score, reasons } = scoreComic(
          comic,
          preferences,
          userReviews.length
        );
        return {
          comic,
          score,
          matchReasons: reasons,
        };
      })
      .filter((item) => item.score > 0.2) // Minimum relevance threshold
      .sort((a, b) => b.score - a.score);

    // 5. Add diversity - ensure not all recommendations are from same publisher
    const diverseRecommendations: ScoredComic[] = [];
    const publisherCount = new Map<string, number>();
    const maxPerPublisher = Math.ceil(limit / 3); // Max 1/3 from same publisher

    for (const item of scoredComics) {
      const publisher = item.comic.publisher;
      const count = publisherCount.get(publisher) || 0;

      if (count < maxPerPublisher) {
        diverseRecommendations.push(item);
        publisherCount.set(publisher, count + 1);
      }

      if (diverseRecommendations.length >= limit) {
        break;
      }
    }

    // If we don't have enough diverse recommendations, fill with top scores
    if (diverseRecommendations.length < limit) {
      for (const item of scoredComics) {
        if (!diverseRecommendations.includes(item)) {
          diverseRecommendations.push(item);
          if (diverseRecommendations.length >= limit) {
            break;
          }
        }
      }
    }

    // 6. Format response
    const recommendations = diverseRecommendations
      .slice(0, limit)
      .map((item) => ({
        ...item.comic,
        recommendationScore: Math.round(item.score * 100) / 100,
        matchReasons: item.matchReasons,
      }));

    return NextResponse.json({
      recommendations,
      totalReviews: userReviews.length,
      preferencesAnalyzed: {
        topCharacters: Array.from(preferences.characters.entries())
          .sort((a, b) => b[1].score - a[1].score)
          .slice(0, 5)
          .map(([name, data]) => ({
            name,
            avgScore: Math.round((data.score / data.count) * 100) / 100,
          })),
        topPublishers: Array.from(preferences.publishers.entries())
          .sort((a, b) => b[1].score - a[1].score)
          .slice(0, 3)
          .map(([name, data]) => ({
            name,
            avgScore: Math.round((data.score / data.count) * 100) / 100,
          })),
        topAuthors: Array.from(preferences.authors.entries())
          .sort((a, b) => b[1].score - a[1].score)
          .slice(0, 5)
          .map(([name, data]) => ({
            name,
            avgScore: Math.round((data.score / data.count) * 100) / 100,
          })),
        prefersIndie:
          preferences.isIndie.totalRatings > 0
            ? preferences.isIndie.score / preferences.isIndie.totalRatings > 0.5
            : null,
      },
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
