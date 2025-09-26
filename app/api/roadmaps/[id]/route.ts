import { prisma } from "@/lib/db";
import { NoUserError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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
        { status: "error", message: "Missing required roadmap id" },
        { status: 401 }
      );
    }

    const data = await prisma.roadmap.findFirst({
      where: {
        id: roadmapId,
      },
      select: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullname: true,
            username: true,
            photo: true,
          },
        },
        image: true,
        title: true,
        description: true,
        createdAt: true,
        isPublic: true,
        entries: {
          orderBy: {
            order: "asc",
          },
          include: {
            comic: {
              select: {
                image: true,
                name: true,
              },
            },
          },
        },
        id: true,
        likes: true,
      },
    });

    if (!data) {
      return NextResponse.json(
        { status: "error", message: "Roadmap not found" },
        { status: 404 }
      );
    }

    if (data.isPublic === false && data.creator.id !== userId) {
      return NextResponse.json(
        {
          status: "error",
          message: "You are not authorized to get those data",
        },
        { status: 401 }
      );
    }

    const roadmap = data
      ? {
          ...data,
          // Only check if logged in user has liked/bookmarked
          isLikedByCurrentUser: userId ? (data.likes?.length || 0) > 0 : false,
        }
      : data;

    return NextResponse.json(
      { status: "success", data: roadmap },
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

export async function DELETE(
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
        { status: "error", message: "Missing roadamap id" },
        { status: 401 }
      );
    }

    const roadmap = await prisma.roadmap.findFirst({
      where: { id: roadmapId },
    });
    if (!roadmap) {
      return NextResponse.json(
        { status: "error", message: "roadmap not found" },
        { status: 404 }
      );
    }

    if (roadmap.createdBy !== userId) {
      return NextResponse.json(
        { status: "error", message: "You can only delete your own roadmaps" },
        { status: 403 }
      );
    }

    await prisma.roadmap.delete({ where: { id: roadmapId } });

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
        points: user?.points - 10,
      },
    });

    return NextResponse.json(
      { status: "success", message: "Roadamap Deleted Successfully" },
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
    const { title, description } = await request.json();

    const existingRoadmap = await prisma.roadmap.findFirst({
      where: {
        id: roadmapId,
      },
    });

    if (!existingRoadmap) {
      return NextResponse.json(
        { status: "error", message: "Roadamap does not exist" },
        { status: 401 }
      );
    }

    if (existingRoadmap.createdBy !== userId) {
      return NextResponse.json(
        { status: "error", message: "You can only edit your roadmaps" },
        { status: 401 }
      );
    }

    await prisma.roadmap.update({
      where: {
        id: roadmapId,
      },
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(
      { status: "success", message: "Roadamap updated Successfully" },
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
