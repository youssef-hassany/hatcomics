import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { COMIC_VINE_API_KEY, comicVineBaseUrl } from "@/constants/comic-vine";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const resource = searchParams.get("resource") || "issue"; // Default to 'issue' instead of 'volume'
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  if (!query) {
    return NextResponse.json(
      { error: "Missing search query parameter `q`." },
      { status: 400 }
    );
  }

  // Validate resource type
  const validResources = [
    "character",
    "concept",
    "location",
    "issue",
    "story_arc",
    "volume",
    "publisher",
    "person",
    "team",
    "video",
    "object",
  ];

  if (!validResources.includes(resource)) {
    return NextResponse.json(
      {
        error: `Invalid resource type. Valid options: ${validResources.join(
          ", "
        )}`,
      },
      { status: 400 }
    );
  }

  try {
    const offset = (page - 1) * limit;

    const response = await axios.get(`${comicVineBaseUrl}/search/`, {
      params: {
        api_key: COMIC_VINE_API_KEY,
        format: "json",
        query,
        resources: resource,
        limit,
        offset,
      },
      headers: {
        "User-Agent": "hat-comics/1.0",
      },
    });

    return NextResponse.json({
      results: response.data.results,
      totalResults: response.data.number_of_total_results,
      page,
      limit,
      hasMore: response.data.results.length === limit,
      offset,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch comics", details: error.message },
      { status: 500 }
    );
  }
}
