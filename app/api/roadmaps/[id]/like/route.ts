import { prisma } from "@/lib/db";
import { NoUserError } from "@/lib/utils";
import { notificationService } from "@/services/notification.service";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
      NoUserError();
      return;
    }

    await prisma.like.create({
      data: {
        roadmapId: id,
        userId: userId!,
      },
    });

    const roadmap = await prisma.roadmap.findFirst({
      where: {
        id,
      },
    });

    if (roadmap && roadmap.createdBy !== userId) {
      await notificationService.createLikeNotification(
        roadmap.createdBy,
        userId,
        "ROADMAP",
        roadmap.id,
        `/roadmaps/${roadmap.id}`
      );
    }

    return NextResponse.json(
      { status: "success", message: "Like added to post" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
      NoUserError();
      return;
    }

    await prisma.like.delete({
      where: {
        userId_roadmapId: {
          userId: userId!,
          roadmapId: id,
        },
      },
    });

    return NextResponse.json(
      { status: "success", message: "Like removed from post" },
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
