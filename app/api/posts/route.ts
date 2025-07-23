import { prisma } from "@/lib/db";
import paginator from "@/lib/pagination";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page");

  try {
    const posts = await prisma.post.findMany({
      where: {
        isDraft: false,
      },
      select: {
        id: true,
        title: true,
        user: true,
        likes: true,
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const { paginatedData, hasNextPage, currentPage, totalPages } = paginator(
      posts,
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
    const { userId, content, title, isDraft, postId } = await req.json();

    if (!userId || !content || !title) {
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

    let post;

    // if there is a postId then the post was a draft so now we can make it not a draft
    if (postId) {
      post = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          isDraft: false,
        },
      });
    } else {
      post = await prisma.post.create({
        data: {
          title,
          content,
          userId,
          isDraft: !!isDraft,
        },
      });
    }

    // give the user 5 points
    await prisma.user.update({
      data: {
        points: user.points + 5,
      },
      where: { id: userId },
    });

    return NextResponse.json(
      { status: "success", data: post },
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
