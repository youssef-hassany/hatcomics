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
  const author = searchParams.get("author");
  const name = searchParams.get("name");
  const language = searchParams.get("language");
  const isBeginnerFriendlyParam = searchParams.get("isBeginnerFriendly");
  const isIndieParam = searchParams.get("isIndie");
  const sortBy = searchParams.get("sortBy") as
    | "A-Z"
    | "Z-A"
    | "rating"
    | "relevance"
    | "none"
    | null;
  const longevity = searchParams.get("longevity") as
    | "short"
    | "medium"
    | "long"
    | null;

  // Convert string parameters to boolean if present
  const isBeginnerFriendly = isBeginnerFriendlyParam
    ? isBeginnerFriendlyParam === "true"
    : undefined;

  const isIndie = isIndieParam ? isIndieParam === "true" : undefined;

  try {
    const whereClause: any = {};

    // Smart name search with fuzzy matching
    if (name && name.trim()) {
      const searchTerm = name.trim();

      // Use PostgreSQL's full-text search with fuzzy matching
      // This will match partial words, handle typos, and rank by relevance
      whereClause.OR = [
        // Exact match (highest priority)
        {
          name: {
            equals: searchTerm,
            mode: "insensitive",
          },
        },
        // Starts with (high priority)
        {
          name: {
            startsWith: searchTerm,
            mode: "insensitive",
          },
        },
        // Contains (medium priority)
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        // Word-level matching for multi-word searches
        ...(searchTerm.includes(" ")
          ? [
              {
                name: {
                  contains: searchTerm.split(" ").join(" | "),
                  mode: "insensitive",
                },
              },
            ]
          : []),
        // Individual word matching for multi-word comic names
        ...searchTerm.split(" ").map((word) => ({
          name: {
            contains: word,
            mode: "insensitive",
          },
        })),
      ];
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

    if (isIndie !== undefined) {
      whereClause.isIndie = isIndie;
    }

    // Filter by language of reading links
    if (language) {
      whereClause.readingLinksData = {
        some: {
          language: language,
        },
      };
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

    // Determine the order by clause based on sortBy parameter
    let orderBy: any = { createdAt: "desc" }; // default ordering

    if (sortBy) {
      switch (sortBy) {
        case "A-Z":
          orderBy = { name: "asc" };
          break;
        case "Z-A":
          orderBy = { name: "desc" };
          break;
        case "rating":
          orderBy = [
            { averageRating: { sort: "desc", nulls: "last" } },
            { totalReviews: "desc" },
          ];
          break;
        case "relevance":
          // When searching by name, sort by relevance (will be handled post-query)
          orderBy = name ? { name: "asc" } : { createdAt: "desc" };
          break;
        case "none":
        default:
          orderBy = { createdAt: "desc" };
          break;
      }
    }

    let comics = await prisma.comic.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      orderBy,
    });

    // Filter by character if specified (for partial matching)
    if (character) {
      comics = comics.filter((comic) =>
        comic.characters.some((char) =>
          char.toLowerCase().includes(character.toLowerCase())
        )
      );
    }

    // Filter by author if specified (for partial matching)
    if (author) {
      comics = comics.filter((comic) =>
        comic.authors.some((auth) =>
          auth.toLowerCase().includes(author.toLowerCase())
        )
      );
    }

    // Custom relevance sorting for name searches
    if (name && sortBy === "relevance") {
      const searchTerm = name.trim().toLowerCase();

      comics = comics.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        // Exact match gets highest priority
        if (aName === searchTerm && bName !== searchTerm) return -1;
        if (bName === searchTerm && aName !== searchTerm) return 1;

        // Starts with gets next priority
        const aStartsWith = aName.startsWith(searchTerm);
        const bStartsWith = bName.startsWith(searchTerm);
        if (aStartsWith && !bStartsWith) return -1;
        if (bStartsWith && !aStartsWith) return 1;

        // Calculate similarity score based on position and length
        const aIndex = aName.indexOf(searchTerm);
        const bIndex = bName.indexOf(searchTerm);

        if (aIndex !== -1 && bIndex !== -1) {
          // Earlier position in string is better
          if (aIndex !== bIndex) return aIndex - bIndex;
          // Shorter total length is better (more relevant match)
          return a.name.length - b.name.length;
        }

        // Fallback to alphabetical
        return aName.localeCompare(bName);
      });
    }

    return NextResponse.json(
      {
        status: "success",
        data: comics,
        searchInfo: name
          ? {
              searchTerm: name,
              resultCount: comics.length,
              sortedBy: "relevance",
            }
          : undefined,
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
