import { prisma } from "@/lib/db";
import { uploadImageToR2FromServer } from "@/lib/upload-media";
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
        createdAt: true,
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
    if (!userId) {
      return NextResponse.json(
        { status: "error", message: "User not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { status: "error", message: "Comic Id is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const images = formData.getAll("images") as File[];
    const content = formData.get("content") as string;
    const hasSpoiler = formData.get("hasSpoiler");

    // Validate max 4 images upfront
    if (images && images.length > 4) {
      return NextResponse.json(
        { status: "error", message: "Maximum 4 images allowed" },
        { status: 400 }
      );
    }

    // Filter valid images
    const validImages = images.filter(
      (image) => image instanceof File && image.size > 0
    );

    // Upload all images in parallel instead of sequentially
    const imageUploadPromises = validImages.map((image) =>
      uploadImageToR2FromServer(image, "thoughts").catch((error) => {
        console.error("Error uploading image:", error);
        return null; // Return null for failed uploads
      })
    );

    const uploadResults = await Promise.all(imageUploadPromises);
    const imageUrls = uploadResults
      .filter((result) => result !== null)
      .map((result) => result!.fileUrl);

    // Use a transaction to combine user fetch, post creation, and user update
    const result = await prisma.$transaction(async (tx) => {
      // Get user data
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, points: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Create post and update user points in parallel
      const [newPost] = await Promise.all([
        tx.post.create({
          data: {
            content,
            attachments: imageUrls,
            comicId: id,
            hasSpoiler: hasSpoiler === "true",
            userId: userId,
          },
        }),
        tx.user.update({
          where: { id: userId },
          data: {
            points: user.points + 5,
          },
        }),
      ]);

      return newPost;
    });

    return NextResponse.json(
      { status: "success", data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating thought:", error);

    // Don't expose internal error details in production
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}
