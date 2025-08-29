import { prisma } from "@/lib/db";
import { uploadImageToR2FromServer } from "@/lib/upload-media";
import { NoUserError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) NoUserError();

    const { id: postId, commentId } = await params;

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
        userId: userId!,
        postId: postId,
        replyTo: commentId,
      },
    });

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
