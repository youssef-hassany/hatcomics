import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { COMIC_VINE_API_KEY, comicVineBaseUrl } from "@/constants/comic-vine";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource, id } = await params;

  // Validate resource type
  const validResources = ["issue", "volume"];

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

  // Validate ID
  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Invalid or missing ID parameter." },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `${comicVineBaseUrl}/${resource}/4000-${id}/`,
      {
        params: {
          api_key: COMIC_VINE_API_KEY,
          format: "json",
        },
        headers: {
          "User-Agent": "hat-comics/1.0",
        },
      }
    );

    // Check if the API returned an error
    if (response.data.status_code !== 1) {
      return NextResponse.json(
        {
          error: "Comic not found or API error",
          details: response.data.error || "Unknown error",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      results: response.data.results,
      status_code: response.data.status_code,
      error: response.data.error,
    });
  } catch (error: any) {
    console.error(`Error fetching ${resource} with ID ${id}:`, error.message);

    return NextResponse.json(
      {
        error: `Failed to fetch ${resource}`,
        details: error.response?.data?.error || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
