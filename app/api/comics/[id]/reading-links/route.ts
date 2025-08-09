import { prisma } from "@/lib/db";
import { NoUserError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) NoUserError();

    const user = await prisma.user.findFirst({
      where: { id: userId! },
    });

    if (
      user?.role !== "owner" &&
      user?.role !== "translator" &&
      user?.role !== "admin"
    ) {
      return NextResponse.json(
        { status: "error", message: "You don't have access for this action" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const { link } = await request.json();

    const comic = await prisma.comic.update({
      where: {
        id,
      },
      data: {
        readingLinks: {
          push: link,
        },
      },
    });

    return NextResponse.json(
      { status: "success", data: comic },
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
    const { userId } = await auth();

    if (!userId) NoUserError();

    const user = await prisma.user.findFirst({
      where: { id: userId! },
    });

    if (user?.role !== "owner" && user?.role !== "admin") {
      return NextResponse.json(
        { status: "error", message: "You don't have access for this action" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const { link } = await request.json();

    // First, get the current comic to check if the link exists
    const currentComic = await prisma.comic.findUnique({
      where: { id },
      select: { readingLinks: true },
    });

    if (!currentComic) {
      return NextResponse.json(
        { status: "error", message: "Comic not found" },
        { status: 404 }
      );
    }

    if (!currentComic.readingLinks.includes(link)) {
      return NextResponse.json(
        { status: "error", message: "Reading link not found" },
        { status: 404 }
      );
    }

    // Remove the link from the array
    const updatedLinks = currentComic.readingLinks.filter(
      (existingLink) => existingLink !== link
    );

    const comic = await prisma.comic.update({
      where: { id },
      data: {
        readingLinks: updatedLinks,
      },
    });

    return NextResponse.json(
      { status: "success", data: comic },
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
