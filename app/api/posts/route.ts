import { prisma } from "@/lib/db";
import paginate from "@/lib/pagination";
import { notificationService } from "@/services/notification.service";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page");

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { status: "error", message: "User not authenticated or doesn't exist" },
        { status: 401 }
      );
    }

    const data = await paginate({
      model: "post",
      where: {
        AND: [{ isDraft: false }, { comicId: null }],
      },
      select: {
        id: true,
        title: true,
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
        bookmarks: {
          where: { userId }, // Only get current user's bookmark
          select: { userId: true },
        },
        _count: {
          select: {
            bookmarks: true,
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

    const posts = data.data.map((post: any) => ({
      ...post,
      isLikedByCurrentUser: post.likes.length > 0,
      isBookmarked: post.bookmarks.length > 0,
    }));

    return NextResponse.json(
      {
        status: "success",
        data: posts,
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

    const { content, title, isDraft, postId } = await req.json();

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

    if (!isDraft && !postId) {
      // Only notify on new published posts, not when publishing drafts
      await notificationService.notifyFollowersOfNewPost(
        userId,
        post.id,
        `/posts/${post.id}`
      );
    }

    return NextResponse.json(
      { status: "success", data: post },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
