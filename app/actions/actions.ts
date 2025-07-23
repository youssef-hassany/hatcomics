"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface CreateComicData {
  name: string;
  description?: string;
  publisher: string;
  authors: string[];
  characters: string[];
  numberOfIssues: number;
  image?: string;
  isBeginnerFriendly?: boolean;
  readingLinks: string[];
}

export async function createComic(data: CreateComicData) {
  try {
    // Get the current user
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: Please log in to create a comic");
    }

    // Validate required fields
    if (
      !data.name ||
      !data.publisher ||
      !data.authors.length ||
      !data.numberOfIssues
    ) {
      throw new Error(
        "Missing required fields: name, publisher, authors, and numberOfIssues are required"
      );
    }

    // Validate numberOfIssues is positive
    if (data.numberOfIssues <= 0) {
      throw new Error("Number of issues must be greater than 0");
    }

    // Validate reading links are valid URLs (optional but recommended)
    if (data.readingLinks.length > 0) {
      for (const link of data.readingLinks) {
        try {
          new URL(link);
        } catch {
          throw new Error(`Invalid URL provided in reading links: ${link}`);
        }
      }
    }

    // Find the user in the database using clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    // Create the comic
    const comic = await prisma.comic.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        publisher: data.publisher.trim(),
        authors: data.authors.map((author) => author.trim()).filter(Boolean),
        characters: data.characters.map((char) => char.trim()).filter(Boolean),
        numberOfIssues: data.numberOfIssues,
        image: data.image?.trim() || null,
        isBeginnerFriendly: data.isBeginnerFriendly || false,
        readingLinks: data.readingLinks
          .map((link) => link.trim())
          .filter(Boolean),
        totalReviews: 0,
        averageRating: null,
      },
    });

    // Revalidate relevant pages
    revalidatePath("/comics");
    revalidatePath("/dashboard");

    return {
      success: true,
      comic,
      message: "Comic created successfully!",
    };
  } catch (error) {
    console.error("Error creating comic:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create comic",
    };
  }
}

// Alternative version with form data handling
export async function createComicFromFormData(formData: FormData) {
  try {
    // Extract and parse form data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const publisher = formData.get("publisher") as string;
    const authorsString = formData.get("authors") as string;
    const charactersString = formData.get("characters") as string;
    const numberOfIssues = parseInt(formData.get("numberOfIssues") as string);
    const image = formData.get("image") as string;
    const isBeginnerFriendly = formData.get("isBeginnerFriendly") === "true";
    const readingLinksString = formData.get("readingLinks") as string;

    // Parse arrays from comma-separated strings
    const authors = authorsString
      ? authorsString
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const characters = charactersString
      ? charactersString
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const readingLinks = readingLinksString
      ? readingLinksString
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const data: CreateComicData = {
      name,
      description: description || undefined,
      publisher,
      authors,
      characters,
      numberOfIssues,
      image: image || undefined,
      isBeginnerFriendly,
      readingLinks,
    };

    const result = await createComic(data);

    if (result.success) {
      redirect("/comics");
    }

    return result;
  } catch (error) {
    console.error("Error processing form data:", error);
    return {
      success: false,
      error: "Failed to process form data",
    };
  }
}
