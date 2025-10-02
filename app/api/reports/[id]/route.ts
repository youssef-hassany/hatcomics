import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// DELETE - Delete a specific report
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.report.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Report deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete report: ${error}` },
      { status: 500 }
    );
  }
}
