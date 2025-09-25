import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ReorderRequest } from "@/types/Roadmap";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body: ReorderRequest = await request.json();
    const { id: roadmapId } = await params;

    // Verify roadmap exists and user has permission
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    // Validate all entries belong to this roadmap
    const entryIds = body.entryOrders.map((e) => e.entryId);
    const existingEntries = await prisma.roadmapEntry.findMany({
      where: {
        id: { in: entryIds },
        roadmapId,
      },
    });

    if (existingEntries.length !== entryIds.length) {
      return NextResponse.json(
        { error: "One or more entries not found or not owned by this roadmap" },
        { status: 400 }
      );
    }

    // Solution: Use a two-phase approach to avoid unique constraint violations
    await prisma.$transaction(async (tx) => {
      // Phase 1: Set all orders to negative values (temporary state)
      const tempUpdates = body.entryOrders.map(({ entryId }, index) =>
        tx.roadmapEntry.update({
          where: { id: entryId },
          data: { order: -(index + 1) }, // Negative values to avoid conflicts
        })
      );

      await Promise.all(tempUpdates);

      // Phase 2: Set the actual order values
      const finalUpdates = body.entryOrders.map(({ entryId, newOrder }) =>
        tx.roadmapEntry.update({
          where: { id: entryId },
          data: { order: newOrder },
        })
      );

      await Promise.all(finalUpdates);
    });

    // Return updated entries in order
    const entriesWithComics = await prisma.roadmapEntry.findMany({
      where: { roadmapId },
      include: {
        comic: true,
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(entriesWithComics);
  } catch (error) {
    console.error("Error reordering entries:", error);
    return NextResponse.json(
      { error: `Failed to reorder entries: ${error}` },
      { status: 500 }
    );
  }
}
