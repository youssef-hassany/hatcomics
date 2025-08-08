import { prisma } from "@/lib/db";
import { NoUserError } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) NoUserError();

    const topComics = await prisma.comic.findMany({
      orderBy: {
        averageRating: "asc",
      },
      take: 5,
    });

    return NextResponse.json(
      { status: "success", data: topComics },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
