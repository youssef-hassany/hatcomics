import { uploadImageToR2FromServer } from "@/lib/upload-media";
import { NoUserError } from "@/lib/utils";
import { commentService } from "@/services/comment.service";
import { notificationService } from "@/services/notification.service";
import { ContentType } from "@/types/Common";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      NoUserError();
      return;
    }

    const { id: contentId, commentId } = await params;

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

    const reply = await commentService.createComment({
      content,
      attachmentUrl: attachmentUrl,
      userId: userId!,
      contentId: contentId,
      replyTo: commentId,
      contentType,
    });

    const originalComment = await commentService.getCommentById(commentId);

    if (originalComment && originalComment.userId !== userId) {
      await notificationService.createReplyNotification(
        originalComment.userId,
        userId,
        commentId,
        reply.id,
        `/${contentType}s/${contentId}`
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Reply added successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
