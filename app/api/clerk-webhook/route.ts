import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET || "";

// Type for Clerk user.created event data
interface ClerkUserCreatedEvent {
  id: string;
  email_addresses: Array<{
    email_address: string;
    id: string;
  }>;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
}

// Type for the webhook event
interface WebhookEvent {
  type: string;
  data: ClerkUserCreatedEvent;
}

export async function POST(req: Request) {
  const payload = await req.text();
  const headersList = await headers();
  const headerPayload = Object.fromEntries(headersList.entries());

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(payload, headerPayload) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new NextResponse("Invalid webhook", { status: 400 });
  }

  const eventType = evt.type;
  const data = evt.data;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, username } = data;

    const email = email_addresses[0]?.email_address;

    if (!email) {
      console.error("No email found for user:", id);
      return new NextResponse("No email found", { status: 400 });
    }

    try {
      await prisma.user.create({
        data: {
          clerkId: id,
          email,
          fullname: `${first_name} ${last_name}`,
          username: username || "",
        },
      });

      console.log("User created successfully:", id);
    } catch (error) {
      console.error("Failed to create user in database:", error);
      return new NextResponse("Database error", { status: 500 });
    }
  }

  return new NextResponse("OK", { status: 200 });
}
