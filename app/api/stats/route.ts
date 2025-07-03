import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    const user = await prisma.user.findFirst({
      where: { clerkId: userId! },
    });

    if (!user || user.role !== "owner") {
      return NextResponse.json(
        { status: "fail", message: "You are not aithorized to get this data" },
        { status: 401 }
      );
    }

    const usersNum = await prisma.user.count();
    const reviewsNum = await prisma.review.count();
    const postsNum = await prisma.post.count();

    const data = {
      usersNum,
      reviewsNum,
      postsNum,
    };

    return NextResponse.json(
      { status: "success", data: data },
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
