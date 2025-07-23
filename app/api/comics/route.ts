import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { status: "error", message: "User not authenticated or doesn't exist" },
      { status: 401 }
    );
  }

  // Get query parameters from the URL
  const searchParams = req.nextUrl.searchParams;
  const character = searchParams.get("character");
  const publisher = searchParams.get("publisher");
  const isBeginnerFriendlyParam = searchParams.get("isBeginnerFriendly");
  const longevity = searchParams.get("longevity") as
    | "short"
    | "medium"
    | "long"
    | null;

  // Convert isBeginnerFriendly string to boolean if present
  const isBeginnerFriendly = isBeginnerFriendlyParam
    ? isBeginnerFriendlyParam === "true"
    : undefined;

  try {
    const whereClause: any = {};

    if (character) {
      // For partial matching within PostgreSQL arrays, we need to use a different approach
      // We'll filter the results after fetching them
    }

    if (publisher) {
      whereClause.publisher = {
        contains: publisher,
        mode: "insensitive",
      };
    }

    if (isBeginnerFriendly !== undefined) {
      whereClause.isBeginnerFriendly = isBeginnerFriendly;
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

    let comics = await prisma.comic.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Filter by character if specified (for partial matching)
    if (character) {
      comics = comics.filter((comic) =>
        comic.characters.some((char) =>
          char.toLowerCase().includes(character.toLowerCase())
        )
      );
    }

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
