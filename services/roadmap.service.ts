import { prisma } from "@/lib/db";

class RoadmapService {
  async deleteUserRoadmaps(userId: string) {
    await prisma.roadmap.deleteMany({
      where: {
        createdBy: userId,
      },
    });
  }
}

export const roadmapService = new RoadmapService();
