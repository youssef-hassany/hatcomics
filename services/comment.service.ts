import { prisma } from "@/lib/db";
import { ContentType } from "@/types/Common";

interface CommentMutationParams {
  contentType: ContentType;
  contentId: string;
  content: string;
  attachmentUrl?: string;
  userId: string;
  replyTo?: string;
}

interface GetCommentsParams {
  contentId: string;
  contentType: ContentType;
  userId: string | null;
}

class CommentService {
  async getCommentById(commentId: string) {
    // Get all comments for the content
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
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

    return comment;
  }

  async getComments(params: GetCommentsParams) {
    const { contentId, contentType, userId } = params;

    const fieldName =
      contentType === "thought" ? "postId" : (`${contentType}Id` as const);

    // Get all comments for the content
    const comments = await prisma.comment.findMany({
      where: {
        [fieldName]: contentId,
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

    return commentsWithReplies;
  }

  async createComment(params: CommentMutationParams) {
    const { content, contentType, attachmentUrl, userId, contentId, replyTo } =
      params;
    const fieldName =
      contentType === "thought" ? "postId" : (`${contentType}Id` as const);

    return await prisma.comment.create({
      data: {
        content,
        attachment: attachmentUrl,
        [fieldName]: contentId,
        userId,
        replyTo,
      },
      include: {
        post: {
          select: { userId: true },
        },
        review: {
          select: { userId: true },
        },
        roadmap: {
          select: { createdBy: true },
        },
        list: {
          select: { createdBy: true },
        },
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
