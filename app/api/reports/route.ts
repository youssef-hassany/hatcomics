import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET - Get all reports
export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch reports: ${error}` },
      { status: 500 }
    );
  }
}

// POST - Create a report
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { referenceUrl, description } = body;

    if (!referenceUrl) {
      return NextResponse.json(
        { error: "referenceUrl is required" },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        referenceUrl,
        description: description || null,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create report: ${error}` },
      { status: 500 }
    );
  }
}

// DELETE - Delete all reports
export async function DELETE() {
  try {
    await prisma.report.deleteMany();
    return NextResponse.json({ message: "All reports deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete reports: ${error}` },
      { status: 500 }
    );
  }
}
