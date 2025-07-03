import ComicContent from "@/components/comics/ComicContent";
import { prisma } from "@/lib/db";
import { Metadata } from "next";
import React from "react";
import ComicReviewForm from "@/components/reviews/ComicReviewForm";
import ComicReviewsList from "@/components/reviews/ComicReviewsList";

type Props = {
  params: Promise<{ id: string }>;
};

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const comic = await prisma.comic.findFirst({
    where: { id },
  });

  if (!comic) {
    return {
      title: "Comic Not Found",
      description: "The requested Comic could not be found.",
    };
  }

  // Extract plain text from HTML content for description
  const plainTextContent = comic.description
    ? comic.description.replace(/<[^>]*>/g, "").slice(0, 160)
    : `See ${comic.name} at HatComics!`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hatcomics.com";
  const comicUrl = `${baseUrl}/comics/${id}`;

  return {
    title: `${comic.name}`,
    description: plainTextContent,

    // Open Graph for social sharing
    openGraph: {
      title: comic.name,
      description: plainTextContent,
      url: comicUrl,
      siteName: "Your Blog Name",
      type: "article",
      publishedTime: comic.createdAt.toISOString(),
      modifiedTime: comic.updatedAt?.toISOString(),
      authors: comic.authors,
      images: [
        {
          url: comic.image || `${baseUrl}/default-og-image.jpg`,
          width: 1200,
          height: 630,
          alt: comic.name,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: comic.name,
      description: plainTextContent,
      creator: comic.publisher,
      images: [comic.image || `${baseUrl}/default-og-image.jpg`],
    },

    // Additional SEO
    keywords: extractKeywords(comic.description || "", comic.name),
    alternates: {
      canonical: comicUrl,
    },

    // JSON-LD structured data
    other: {
      "article:publisher": comic.publisher,
      "article:published_time": comic.createdAt.toISOString(),
      "article:modified_time":
        comic.updatedAt?.toISOString() || comic.createdAt.toISOString(),
    },
  };
}

// Helper function to extract keywords
function extractKeywords(content: string, title: string): string {
  const text = `${title} ${content.replace(/<[^>]*>/g, "")}`;
  const words = text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 3)
    .slice(0, 10);
  return [...new Set(words)].join(", ");
}

const page = async ({ params }: Props) => {
  const { id } = await params;

  const comic = await prisma.comic.findFirst({
    where: { id },
  });

  if (!comic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4">
            comic Not Found
          </h1>
          <p className="text-zinc-400">
            The comic you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* @ts-ignore */}
      <ComicContent initialComic={comic} />
      <ComicReviewForm comicId={comic.id} />

      <div className="bg-zinc-900 p-4">
        <h3 className="mb-4 font-bold text-2xl">Comic Reviews:</h3>
        <ComicReviewsList comicId={comic.id} />
      </div>
    </>
  );
};

export default page;
