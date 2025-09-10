import { prisma } from "@/lib/db";
import { uploadImageToR2FromServer } from "@/lib/upload-media";
import { NoUserError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import paginator from "@/lib/pagination";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const page = request.nextUrl.searchParams.get("page");

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { status: "error", message: "User not authenticated or doesn't exist" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { status: "error", message: "Comic Id is required" },
        { status: 401 }
      );
    }

    const data = await prisma.post.findMany({
      where: {
        comicId: id,
      },
      select: {
        id: true,
        content: true,
        attachments: true,
        hasSpoiler: true,
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
    });

    const posts = data.map((post) => ({
      ...post,
      isLikedByCurrentUser: post.likes.length > 0,
      isBookmarked: post.bookmarks.length > 0,
    }));

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const user = await prisma.user.findFirst({
      where: { id: userId! },
    });

    if (!user) {
      NoUserError();
      return;
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { status: "error", message: "Comic Id is required" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const images = formData.getAll("images") as File[];
    const content = formData.get("content") as string;
    const hasSpoiler = formData.get("hasSpoiler");

    const imageUrls: string[] = [];

    // Check if we have images and they're valid files
    if (images && images.length > 0) {
      // Validate max 4 images
      if (images.length > 4) {
        return NextResponse.json(
          { status: "error", message: "Maximum 4 images allowed" },
          { status: 400 }
        );
      }

      // Filter out empty files and upload valid ones
      const validImages = images.filter(
        (image) => image instanceof File && image.size > 0
      );

      for (const image of validImages) {
        try {
          const { fileUrl } = await uploadImageToR2FromServer(
            image,
            "thoughts"
          );
          imageUrls.push(fileUrl);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          // You might want to continue or return error based on your needs
        }
      }
    }

    const newThought = await prisma.post.create({
      data: {
        content,
        attachments: imageUrls,
        comicId: id,
        hasSpoiler: hasSpoiler === "true",
        userId: userId!,
      },
    });

    // give the user 5 points
    await prisma.user.update({
      data: {
        points: user.points + 5,
      },
      where: { id: userId! },
    });

    return NextResponse.json(
      { status: "success", data: newThought },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating thought:", error);
    return NextResponse.json(
      { status: "error", message: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
