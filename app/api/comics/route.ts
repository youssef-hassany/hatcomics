import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { COMIC_VINE_API_KEY, comicVineBaseUrl } from "@/constants/comic-vine";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Missing search query parameter `q`." },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(`${comicVineBaseUrl}/search/`, {
      params: {
        api_key: COMIC_VINE_API_KEY,
        format: "json",
        query,
        resources: "volume",
      },
      headers: {
        "User-Agent": "hat-comics/1.0",
      },
    });

    return NextResponse.json(response.data.results);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch comics", details: error.message },
      { status: 500 }
    );
  }
}
