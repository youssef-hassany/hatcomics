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
    }

    const review = await prisma.review.findMany({
      include: {
        comic: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const { paginatedData, hasNextPage, currentPage, totalPages } = paginate(
      review,
      page
    );

    return NextResponse.json(
      {
        status: "success",
        data: paginatedData,
        hasNextPage,
        currentPage,
        totalPages,
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
    const { userId, comicId, rating, description, spoiler } = await req.json();

    if (!userId || !rating || !comicId) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required fields: userId, content, or title",
        },
        { status: 400 }
      );
    }

    if (parseInt(rating) > 5 || parseInt(rating) < 1) {
      return NextResponse.json(
        {
          status: "error",
          message: "Rating must be between 1 star to 5 stars",
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
        rating,
        description,
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
    const newAvgRate = (avgRate * reviewsNum + rating) / newReviewsNum;

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
