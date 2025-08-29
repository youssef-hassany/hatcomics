import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const usernameRegex = /^[a-zA-Z0-9._]{1,20}$/;

    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Username must only contain letters, numbers, '.' and '_'",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (user) {
      return NextResponse.json(
        {
          status: "error",
          message: "Username is taken",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { status: "success", message: "Username is valid" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
