import { prisma } from "@/lib/db";
import { NoUserError } from "@/lib/utils";
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
    }

    await prisma.like.create({
      data: {
        roadmapId: id,
        userId: userId!,
      },
    });

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
    }

    await prisma.like.delete({
      where: {
        userId_roadmapId: {
          roadmapId: id,
          userId: userId!,
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
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
