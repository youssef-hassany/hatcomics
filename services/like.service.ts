import { prisma } from "@/lib/db";
import { ContentType } from "@/types/Common";

interface LikeMutationParams {
  contentType: ContentType;
  contentId: string;
  userId: string;
}

class LikeService {
  async addLike(params: LikeMutationParams) {
    const { contentId, contentType, userId } = params;
    const fieldName = `${contentType}Id`;

    await prisma.like.create({
      data: {
        userId,
        [fieldName]: contentId,
      },
    });
  }

  async removeLike(params: LikeMutationParams) {
    const { contentId, contentType, userId } = params;
    const fieldName = `${contentType}Id` as const;

    await prisma.like.deleteMany({
      where: {
        userId,
        [fieldName]: contentId,
      },
    });
  }
}

export const likeService = new LikeService();
