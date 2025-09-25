import { prisma } from "@/lib/db";
import { AddEntryRequest } from "@/types/Roadmap";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body: AddEntryRequest = await request.json();
    const { id: roadmapId } = await params;

    // Verify roadmap exists and user has permission
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    const comic = body.comic;

    // Use transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Create the roadmap entry with comic data embedded
      const entryData: any = {
        roadmapId,
        title: body.title,
        description: body.description,
        order: body.order,
        comicName: comic.name!,
      };

      if (comic.source === "local") {
        // Internal comic - just reference it
        entryData.comicId = comic.id;
        // The comic name, publisher, etc. will come from the relation
      } else if (comic.source === "comicvine") {
        // External comic - store metadata directly in the entry
        entryData.externalId = comic.id;
        entryData.externalSource = "comicvine";
        entryData.publisher = comic.publisher;
        entryData.image = comic.image;
        entryData.issueNumber = comic.issueNumber;
        entryData.comicDescription = comic.description;
      }

      const entry = await tx.roadmapEntry.create({
        data: entryData,
      });

      return entry;
    });

    // Return the created entry with populated comic data
    const entryWithComic = await prisma.roadmapEntry.findUnique({
      where: { id: result.id },
      include: {
        comic: true, // This will populate local comic data if comicId is set
      },
    });

    return NextResponse.json(entryWithComic, { status: 201 });
  } catch (error) {
    console.error("Error creating roadmap entry:", error);
    return NextResponse.json(
      { error: `Failed to create roadmap entry: ${error}` },
      { status: 500 }
    );
  }
}
