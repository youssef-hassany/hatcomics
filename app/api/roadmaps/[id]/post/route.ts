import { prisma } from "@/lib/db";
import { NoUserError } from "@/lib/utils";
import { notificationService } from "@/services/notification.service";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      NoUserError();
      return;
    }

    const { id: roadmapId } = await params;
    if (!roadmapId) {
      return NextResponse.json(
        { status: "error", message: "Missing roadmap Id" },
        { status: 401 }
      );
    }

    await prisma.roadmap.update({
      where: {
        id: roadmapId,
      },
      data: {
        isPublic: true,
      },
    });

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      NoUserError();
      return;
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        points: user?.points + 10,
      },
    });

    await notificationService.notifyFollowersOfNewRoadmap(
      userId,
      roadmapId,
      `/roadmaps/${roadmapId}`
    );

    return NextResponse.json(
      { status: "success", message: "Roadmap Posted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
