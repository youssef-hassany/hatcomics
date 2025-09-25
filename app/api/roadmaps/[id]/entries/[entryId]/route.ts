import { prisma } from "@/lib/db";
import { NoUserError } from "@/lib/utils";
import { AddEntryRequest } from "@/types/Roadmap";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      NoUserError();
      return;
    }

    const body: AddEntryRequest = await request.json();
    const { id: roadmapId, entryId } = await params;

    // Verify roadmap exists and user has permission
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    if (roadmap.createdBy !== userId) {
      return NextResponse.json(
        { error: "You can only edit your roadmaps" },
        { status: 401 }
      );
    }

    // Verify entry exists and belongs to this roadmap
    const existingEntry = await prisma.roadmapEntry.findUnique({
      where: {
        id: entryId,
        roadmapId: roadmapId,
      },
    });

    if (!existingEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const comic = body.comic;

    // Use transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Prepare update data, clearing previous comic associations
      const updateData: any = {
        title: body.title,
        description: body.description,
        order: body.order,
        comicName: comic.name!,
        // Clear previous associations
        comicId: null,
        externalId: null,
        externalSource: null,
        publisher: null,
        image: null,
        issueNumber: null,
        comicDescription: null,
      };

      if (comic.source === "local") {
        // Internal comic - just reference it
        updateData.comicId = comic.id;
        // The comic name, publisher, etc. will come from the relation
      } else if (comic.source === "comicvine") {
        // External comic - store metadata directly in the entry
        updateData.externalId = comic.id;
        updateData.externalSource = "comicvine";
        updateData.publisher = comic.publisher;
        updateData.image = comic.image;
        updateData.issueNumber = comic.issueNumber;
        updateData.comicDescription = comic.description;
      }

      const entry = await tx.roadmapEntry.update({
        where: { id: entryId },
        data: updateData,
      });

      return entry;
    });

    // Return the updated entry with populated comic data
    const entryWithComic = await prisma.roadmapEntry.findUnique({
      where: { id: result.id },
      include: {
        comic: true, // This will populate local comic data if comicId is set
      },
    });

    return NextResponse.json(entryWithComic, { status: 200 });
  } catch (error) {
    console.error("Error updating roadmap entry:", error);
    return NextResponse.json(
      { error: `Failed to update roadmap entry: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      NoUserError();
      return;
    }

    const { id: roadmapId, entryId } = await params;

    // Verify roadmap exists and user has permission
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    if (roadmap.createdBy !== userId) {
      return NextResponse.json(
        { error: "You can only edit your roadmaps" },
        { status: 401 }
      );
    }

    await prisma.roadmapEntry.delete({
      where: {
        id: entryId,
      },
    });

    return NextResponse.json(
      { status: "Success", message: "Entry Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting roadmap entry:", error);
    return NextResponse.json(
      { error: `Failed to delete roadmap entry: ${error}` },
      { status: 500 }
    );
  }
}
