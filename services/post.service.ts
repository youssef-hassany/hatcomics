import { prisma } from "@/lib/db";

class PostService {
  async deleteUserPosts(userId: string) {
    await prisma.post.deleteMany({
      where: {
        userId,
      },
    });
  }
}

export const postService = new PostService();
