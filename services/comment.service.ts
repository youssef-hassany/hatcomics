import { prisma } from "@/lib/db";
import { ContentType } from "@/types/Common";

interface CommentMutationParams {
  contentType: ContentType;
  contentId: string;
  content: string;
  attachmentUrl: string;
  userId: string;
}

class CommentService {
  async createComment(params: CommentMutationParams) {
    const { content, contentType, attachmentUrl, userId, contentId } = params;
    const fieldName = `${contentType}Id` as const;

    await prisma.comment.create({
      data: {
        content,
        attachment: attachmentUrl,
        [fieldName]: contentId,
        userId,
      },
    });
  }

  async deleteComment(params: {
    contentType: ContentType;
    contentId: string;
    userId: string;
  }) {
    const { contentType, userId, contentId } = params;
    const fieldName = `${contentType}Id` as const;

    await prisma.comment.deleteMany({
      where: {
        userId,
        [fieldName]: contentId,
      },
    });
  }

  async deleteUserComments(userId: string) {
    await prisma.comment.deleteMany({
      where: {
        userId,
      },
    });
  }
}

export const commentService = new CommentService();
