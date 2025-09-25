import { prisma } from "@/lib/db";
import { uploadImageToR2FromServer } from "@/lib/upload-media";
import { auth } from "@clerk/nextjs/server";
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
    const { id } = await params;
    const { userId } = await auth();

    // Get all comments for the roadmap
    const comments = await prisma.comment.findMany({
      where: {
        roadmapId: id,
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
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Separate top-level comments and replies
    const topLevelComments = comments.filter((comment) => !comment.replyTo);
    const replies = comments.filter((comment) => comment.replyTo);

    // Build nested structure
    const commentsWithReplies = topLevelComments.map((comment) => {
      const commentReplies = replies
        .filter((reply) => reply.replyTo === comment.id)
        .map((reply) => ({
          ...reply,
          isLikedByCurrentUser: userId
            ? reply.likes.some((like) => like.userId === userId)
            : false,
        }))
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ); // Replies in chronological order

      return {
        ...comment,
        isLikedByCurrentUser: userId
          ? comment.likes.some((like) => like.userId === userId)
          : false,
        replies: commentReplies,
      };
    });

    return NextResponse.json(
      { status: "success", data: commentsWithReplies },
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

    const { id } = await params;

    const formData = await request.formData();

    const content = formData.get("content") as string;
    const attachment = formData.get("attachment") as File;

    let attachmentUrl;

    if (attachment) {
      const { fileUrl } = await uploadImageToR2FromServer(
        attachment,
        "comment-images"
      );
      attachmentUrl = fileUrl;
    }

    await prisma.comment.create({
      data: {
        content,
        attachment: attachmentUrl || null,
        userId: userId,
        roadmapId: id,
      },
    });

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
