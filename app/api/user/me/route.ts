import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { status: "error", message: "User Unauthorized" },
        { status: 401 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId! },
      select: {
        id: true,
        fullname: true,
        username: true,
        photo: true,
        points: true,
        role: true,
        email: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: "success", user: currentUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /user error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
