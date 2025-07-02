import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        isDraft: false,
      },
      select: {
        id: true,
        title: true,
        user: true,
        likes: true,
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      { status: "success", data: posts },
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

export async function POST(req: NextRequest) {
  try {
    const { userId, content, title, isDraft } = await req.json();

    if (!userId || !content || !title) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required fields: userId, content, or title",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User not authenticated or doesn't exist" },
        { status: 401 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        userId,
        isDraft: !!isDraft,
      },
    });

    return NextResponse.json(
      { status: "success", data: post },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
