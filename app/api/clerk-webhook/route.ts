import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET || "";

// Type for Clerk user event data
interface ClerkUserEvent {
  id: string;
  email_addresses: Array<{
    email_address: string;
    id: string;
  }>;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  image_url?: string;
  profile_image_url?: string;
}

// Type for the webhook event
interface WebhookEvent {
  type: string;
  data: ClerkUserEvent;
}

// Helper function to generate a username from name parts
function generateUsername(
  firstName: string | null,
  lastName: string | null,
  clerkUsername: string | null,
  email: string
): string {
  // Try Clerk username first (often from social providers)
  if (clerkUsername && clerkUsername.trim() !== "") {
    return clerkUsername.toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  // Try to create username from first and last name
  if (firstName && lastName) {
    return `${firstName.toLowerCase()}${lastName.toLowerCase()}`.replace(
      /[^a-z0-9]/g,
      ""
    );
  }

  // If only first name available
  if (firstName) {
    return firstName.toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  // If only last name available
  if (lastName) {
    return lastName.toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  // Fallback to email prefix
  const emailPrefix = email.split("@")[0];
  return emailPrefix.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Helper function to ensure username uniqueness
async function getUniqueUsername(baseUsername: string): Promise<string> {
  let username = baseUsername;
  let counter = 1;

  // Check if username already exists
  while (await prisma.user.findUnique({ where: { username } })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  return username;
}

export async function POST(req: Request) {
  console.log("🔔 Webhook received");

  try {
    const payload = await req.text();
    const headersList = await headers();

    // Convert headers to a plain object that svix expects
    const heads: Record<string, string> = {};
    headersList.forEach((value, key) => {
      heads[key] = value;
    });

    console.log("📋 Webhook headers:", heads);
    console.log("📦 Webhook payload length:", payload.length);

    if (!WEBHOOK_SECRET) {
      console.error("❌ CLERK_WEBHOOK_SECRET not found");
      return new NextResponse("Webhook secret not configured", { status: 500 });
    }

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;
    try {
      evt = wh.verify(payload, heads) as WebhookEvent;
      console.log("✅ Webhook verification successful");
      console.log("📧 Event type:", evt.type);
    } catch (err) {
      console.error("❌ Webhook verification failed:", err);
      return new NextResponse("Invalid webhook signature", { status: 400 });
    }

    const eventType = evt.type;
    const data = evt.data;

    if (eventType === "user.created") {
      console.log("👤 Processing user.created event");

      const {
        id,
        email_addresses,
        first_name,
        last_name,
        username,
        image_url,
        profile_image_url,
      } = data;

      const email = email_addresses[0]?.email_address;

      if (!email) {
        console.error("❌ No email found for user:", id);
        return new NextResponse("No email found", { status: 400 });
      }

      console.log("📧 Processing user:", {
        id,
        email,
        first_name,
        last_name,
        username,
      });

      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { clerkId: id },
        });

        if (existingUser) {
          console.log("👤 User already exists in database:", id);
          return new NextResponse("User already exists", { status: 200 });
        }

        // Generate username if not provided by Clerk
        let finalUsername = username;
        if (!username || username.trim() === "") {
          const generatedUsername = generateUsername(
            first_name,
            last_name,
            username,
            email
          );
          finalUsername = await getUniqueUsername(generatedUsername);
        } else {
          // Even if username exists, ensure it's unique in our database
          finalUsername = await getUniqueUsername(username);
        }

        // Create full name, handling null values
        const fullName =
          [first_name, last_name]
            .filter((name) => name && name.trim() !== "")
            .join(" ") || "Comic Fan"; // Fallback name

        // Get profile photo from social auth providers
        const photoUrl = image_url || profile_image_url || null;

        console.log("💾 Creating user in database:", {
          clerkId: id,
          email,
          username: finalUsername,
          fullname: fullName,
          photo: photoUrl,
        });

        const newUser = await prisma.user.create({
          data: {
            id: id,
            clerkId: id,
            email,
            fullname: fullName,
            username: finalUsername,
            photo: photoUrl,
          },
        });

        console.log("✅ User created successfully:", newUser);

        return new NextResponse("User created", { status: 200 });
      } catch (error) {
        console.error("❌ Failed to create user in database:", error);

        // Check if it's a unique constraint error
        if (
          error instanceof Error &&
          (error.message.includes("Unique constraint") ||
            error.message.includes("unique constraint"))
        ) {
          console.error("❌ Username or email already exists in database");
          return new NextResponse("User already exists", { status: 409 });
        }

        return new NextResponse("Database error", { status: 500 });
      }
    }

    // Handle user updates (profile changes)
    if (eventType === "user.updated") {
      console.log("🔄 Processing user.updated event");

      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
        profile_image_url,
      } = data;

      const email = email_addresses[0]?.email_address;

      if (!email) {
        console.error("❌ No email found for user:", id);
        return new NextResponse("No email found", { status: 400 });
      }

      try {
        // Create full name, handling null values
        const fullName =
          [first_name, last_name]
            .filter((name) => name && name.trim() !== "")
            .join(" ") || "Comic Fan";

        // Get profile photo from social auth providers
        const photoUrl = image_url || profile_image_url || null;

        const updatedUser = await prisma.user.update({
          where: { clerkId: id },
          data: {
            email,
            fullname: fullName,
            photo: photoUrl,
            // Don't update username to avoid breaking references
          },
        });

        console.log("✅ User updated successfully:", updatedUser);

        return new NextResponse("User updated", { status: 200 });
      } catch (error) {
        console.error("❌ Failed to update user in database:", error);

        if (
          error instanceof Error &&
          error.message.includes("Record to update not found")
        ) {
          console.error("❌ User not found in database for update:", id);
          return new NextResponse("User not found", { status: 404 });
        }

        return new NextResponse("Database error", { status: 500 });
      }
    }

    // Handle user deletion
    if (eventType === "user.deleted") {
      console.log("🗑️ Processing user.deleted event");

      const { id } = data;

      try {
        // Delete the user from the database
        const deletedUser = await prisma.user.delete({
          where: { clerkId: id },
        });

        // Delete the user posts
        await prisma.post.deleteMany({
          where: {
            userId: deletedUser.id,
          },
        });

        // Delete the user Reviews
        await prisma.review.deleteMany({
          where: {
            userId: deletedUser.id,
          },
        });

        console.log("✅ User deleted successfully:", deletedUser);

        return new NextResponse("User deleted", { status: 200 });
      } catch (error) {
        console.error("❌ Failed to delete user from database:", error);

        if (
          error instanceof Error &&
          error.message.includes("Record to delete does not exist")
        ) {
          console.error("❌ User not found in database for deletion:", id);
          return new NextResponse("User not found", { status: 404 });
        }

        return new NextResponse("Database error", { status: 500 });
      }
    }

    console.log("ℹ️ Unhandled event type:", eventType);
    return new NextResponse("Event processed", { status: 200 });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
