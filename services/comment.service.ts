import { prisma } from "@/lib/db";

class CommentService {
  async deleteUserComments(userId: string) {
    await prisma.comment.deleteMany({
      where: {
        userId,
      },
    });
  }
}

export const commentService = new CommentService();
