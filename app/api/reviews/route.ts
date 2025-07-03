import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const review = await prisma.review.findMany({
      include: {
        comic: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      { status: "success", data: review },
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
