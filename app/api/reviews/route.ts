import { prisma } from "@/lib/db";
import paginate from "@/lib/pagination";
import { NoUserError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page");

  try {
    const { userId } = await auth();
    if (!userId) {
      NoUserError();
      return;
    }

    const data = await paginate({
      model: "review",
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
        likes: {
          where: { userId }, // Only get current user's like
          select: { userId: true },
        },
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
      page: Number(page),
    });

    const reviews = data.data.map((review: any) => ({
      ...review,
      isLikedByCurrentUser: review.likes.length > 0,
    }));

    return NextResponse.json(
      {
        status: "success",
        data: reviews,
        hasNextPage: data.meta.hasNextPage,
        currentPage: data.meta.currentPage,
        totalPages: data.meta.totalPages,
      },
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

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const { comicId, rating, description, spoiler } = await req.json();

    if (!userId || !rating || !comicId) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required fields: userId, rating, or comicId",
        },
        { status: 400 }
      );
    }

    const ratingFloat = parseFloat(rating);

    // Validate rating range and increment (only allow 0.5 increments)
    if (ratingFloat < 0.5 || ratingFloat > 5 || (ratingFloat * 2) % 1 !== 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Rating must be between 0.5 and 5 stars in 0.5 increments",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User not authenticated or doesn't exist" },
        { status: 401 }
      );
    }

    const review = await prisma.review.create({
      data: {
        rating: ratingFloat,
        description: description || "",
        spoiler: !!spoiler,
        userId,
        comicId,
      },
    });

    // get the comic first
    const comic = await prisma.comic.findFirst({
      where: { id: comicId },
    });

    // get the comic stats
    const avgRate = comic?.averageRating ? comic.averageRating : 0;
    const reviewsNum = comic?.totalReviews ? comic.totalReviews : 0;

    // calculate the new stats
    const newReviewsNum = reviewsNum + 1;
    const newAvgRate = (avgRate * reviewsNum + ratingFloat) / newReviewsNum;

    // set updated stats
    await prisma.comic.update({
      data: {
        averageRating: newAvgRate,
        totalReviews: newReviewsNum,
      },
      where: {
        id: comicId,
      },
    });

    // add points to the user
    await prisma.user.update({
      data: {
        points: user.points + 2,
      },
      where: {
        id: userId,
      },
    });

    return NextResponse.json(
      { status: "success", data: review },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
