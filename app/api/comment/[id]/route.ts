import { prisma } from "@/lib/db";
import { uploadImageToR2FromServer } from "@/lib/upload-media";
import { commentService } from "@/services/comment.service";
import { notificationService } from "@/services/notification.service";
import { ContentType } from "@/types/Common";
import { auth } from "@clerk/nextjs/server";
import { EntityType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contentId } = await params;
    const { userId } = await auth();

    // Get contentType from query parameters
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get("contentType") as ContentType;

    if (!contentType) {
      return NextResponse.json(
        { status: "error", message: "Content type reuired" },
        { status: 401 }
      );
    }

    if (!contentType) {
      return NextResponse.json(
        { status: "error", message: "contentType is required" },
        { status: 400 }
      );
    }

    const comments = await commentService.getComments({
      contentId,
      contentType,
      userId,
    });

    return NextResponse.json(
      { status: "success", data: comments },
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
        { status: "error", message: "User is not authorized or not found!" },
        { status: 401 }
      );
    }

    const { id: contentId } = await params;

    const formData = await request.formData();

    const content = formData.get("content") as string;
    const contentType = formData.get("contentType") as ContentType;
    const attachment = formData.get("attachment") as File;

    let attachmentUrl;

    if (attachment) {
      const { fileUrl } = await uploadImageToR2FromServer(
        attachment,
        "comment-images"
      );
      attachmentUrl = fileUrl;
    }

    const createdComment = await commentService.createComment({
      attachmentUrl,
      content,
      contentId,
      contentType,
      userId,
    });

    const contentCreatorId = (createdComment.post?.userId ||
      createdComment.review?.userId ||
      createdComment.roadmap?.createdBy ||
      createdComment.list?.createdBy) as string;

    await notificationService.createCommentNotification(
      contentCreatorId,
      userId,
      contentType.toUpperCase() as EntityType,
      createdComment.id,
      contentType === "thought"
        ? `/book-club/${contentId}`
        : `/${contentType}s/${contentId}`
    );

    return NextResponse.json({
      status: "success",
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: `Internal server error ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const user = await prisma.user.findFirst({ where: { clerkId: userId! } });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User is not authorized!" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Find the comment and check if user owns it
    const comment = await prisma.comment.findFirst({
      where: { id },
      include: {
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
      },
    });

    if (!comment) {
      return NextResponse.json(
        { status: "error", message: "Comment not found!" },
        { status: 404 }
      );
    }

    // Check if user owns the comment or is an admin
    if (
      comment.userId !== user.id &&
      user.role !== "admin" &&
      user.role !== "owner"
    ) {
      return NextResponse.json(
        { status: "error", message: "You can only delete your own comments!" },
        { status: 403 }
      );
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({
      status: "success",
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const user = await prisma.user.findFirst({ where: { clerkId: userId! } });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User is not authorized!" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { content } = await request.json();

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { status: "error", message: "Content is required!" },
        { status: 400 }
      );
    }

    // Find the comment and check if user owns it
    const comment = await prisma.comment.findFirst({
      where: { id },
      include: {
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
      },
    });

    if (!comment) {
      return NextResponse.json(
        { status: "error", message: "Comment not found!" },
        { status: 404 }
      );
    }

    // Check if user owns the comment or is an admin
    if (
      comment.userId !== user.id &&
      user.role !== "admin" &&
      user.role !== "owner"
    ) {
      return NextResponse.json(
        { status: "error", message: "You can only edit your own comments!" },
        { status: 403 }
      );
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content: content.trim(),
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullname: true,
            photo: true,
          },
        },
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Comment updated successfully",
      data: updatedComment,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
