import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const readlist = await prisma.readlist.findMany({
      where: {
        userId: id,
      },
      include: {
        comic: true,
      },
    });

    return NextResponse.json({ status: "success", data: readlist });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
