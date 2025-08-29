import { prisma } from "@/lib/db";
import { NoUserError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; comicId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) NoUserError();

    const { id, comicId } = await params;

    if (userId !== id) {
      return NextResponse.json(
        { status: "error", message: "You Can't Delete other users data" },
        { status: 403 }
      );
    }

    const newComicInReadList = await prisma.readlist.create({
      data: {
        userId: id,
        comicId: comicId,
      },
    });

    return NextResponse.json(
      { status: "success", data: newComicInReadList },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; comicId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) NoUserError();

    const { id, comicId } = await params;

    if (userId !== id) {
      return NextResponse.json(
        { status: "error", message: "You Can't Delete other users data" },
        { status: 403 }
      );
    }

    const newComicInReadList = await prisma.readlist.delete({
      where: {
        userId_comicId: {
          comicId: comicId,
          userId: id,
        },
      },
    });

    return NextResponse.json(
      { status: "success", data: newComicInReadList },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
