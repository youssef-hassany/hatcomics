import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { userId } = await auth();
    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { status: "error", message: "Username is required" },
        { status: 400 }
      );
    }

    // Find the user by username
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User not found" },
        { status: 404 }
      );
    }

    // Get logged in user ID for follow status check
    let loggedInUserId: string | null = null;
    if (userId) {
      const loggedInUser = await prisma.user.findFirst({
        where: { clerkId: userId },
        select: { id: true },
      });
      loggedInUserId = loggedInUser?.id || null;
    }

    // Get following with their details
    const following = await prisma.follow.findMany({
      where: {
        followerId: user.id, // People this user follows
      },
      select: {
        following: {
          select: {
            id: true,
            username: true,
            fullname: true,
            photo: true,
            points: true,
            role: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Check if logged in user follows each person in the following list
    const followingWithStatus = await Promise.all(
      following.map(async (follow) => {
        let isFollowed = false;

        if (loggedInUserId && loggedInUserId !== follow.following.id) {
          const followRelation = await prisma.follow.findFirst({
            where: {
              followerId: loggedInUserId,
              followingId: follow.following.id,
            },
          });
          isFollowed = !!followRelation;
        }

        return {
          ...follow.following,
          isFollowed,
          isOwnProfile: loggedInUserId === follow.following.id,
          followedAt: follow.createdAt,
        };
      })
    );

    return NextResponse.json(
      {
        status: "success",
        data: {
          following: followingWithStatus,
          total: followingWithStatus.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching following:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
