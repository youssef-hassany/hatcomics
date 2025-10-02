import { prisma } from "@/lib/db";

class UserService {
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  }

  /* ban user logic */
  async banUser(userId: string) {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isBanned: true,
        points: 0,
      },
    });
  }

  async unBanUser(userId: string) {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isBanned: false,
      },
    });
  }
}

export const userService = new UserService();
