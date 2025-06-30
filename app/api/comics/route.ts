import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Get query parameters from the URL
  const searchParams = req.nextUrl.searchParams;
  const character = searchParams.get("character");
  const publisher = searchParams.get("publisher");
  const isUserFriendlyParam = searchParams.get("isUserFriendly");
  const longevity = searchParams.get("longevity") as
    | "short"
    | "medium"
    | "long"
    | null;

  // Convert isUserFriendly string to boolean if present
  const isUserFriendly = isUserFriendlyParam
    ? isUserFriendlyParam === "true"
    : undefined;

  try {
    const whereClause: any = {};

    if (character) {
      whereClause.characters = {
        has: character,
        mode: "insensitive",
      };
    }

    if (publisher) {
      whereClause.publisher = {
        contains: publisher,
        mode: "insensitive",
      };
    }

    if (isUserFriendly !== undefined) {
      whereClause.isUserFriendly = isUserFriendly;
    }

    if (longevity) {
      switch (longevity) {
        case "short":
          whereClause.numberOfIssues = {
            gte: 1,
            lte: 12,
          };
          break;
        case "medium":
          whereClause.numberOfIssues = {
            gte: 13,
            lte: 30,
          };
          break;
        case "long":
          whereClause.numberOfIssues = {
            gt: 30,
          };
          break;
      }
    }

    const comics = await prisma.comic.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      include: {
        addedBy: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      omit: {
        addedById: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        status: "success",
        data: comics,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching comics:", error);

    return NextResponse.json(
      {
        status: "error",
        error: "Failed to fetch comics",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
