import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ followingId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { status: "error", message: "User not authenticated or not found" },
        { status: 400 }
      );
    }

    const { followingId } = await params;
    if (!followingId) {
      return NextResponse.json(
        { status: "error", message: "Missing following id" },
        { status: 400 }
      );
    }

    await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: followingId,
      },
    });

    return NextResponse.json(
      { status: "success", message: "follow done successfully" },
      { status: 201 }
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
  { params }: { params: Promise<{ followingId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { status: "error", message: "User not authenticated or not found" },
        { status: 400 }
      );
    }

    const { followingId } = await params;

    if (!followingId) {
      return NextResponse.json(
        { status: "error", message: "Missing following id" },
        { status: 400 }
      );
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: followingId,
        },
      },
    });

    return NextResponse.json(
      { status: "success", message: "follow removed successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
