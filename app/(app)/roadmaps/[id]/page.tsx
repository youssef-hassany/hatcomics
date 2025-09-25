import { prisma } from "@/lib/db";
import { Metadata } from "next";
import React from "react";
import RoadmapPageClient from "@/components/roadmap/RoadmapPageClient";

type Props = {
  params: Promise<{ id: string }>;
};

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const roadmap = await prisma.roadmap.findFirst({
    where: { id },
  });

  if (!roadmap) {
    return {
      title: "roadmap Not Found",
      description: "The requested roadmap could not be found.",
    };
  }

  // Extract plain text from HTML content for description
  const plainTextContent = roadmap.description
    ? roadmap.description.replace(/<[^>]*>/g, "").slice(0, 160)
    : `See '${roadmap.title}' Roadmap at HatComics!`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hat-comics.com";
  const roadmapUrl = `${baseUrl}/roadmaps/${id}`;

  return {
    title: `${roadmap.title} | HatComics - Comic Reviews & Discussion`,
    description: plainTextContent,

    // Open Graph for social sharing
    openGraph: {
      title: roadmap.title,
      description: plainTextContent,
      url: roadmapUrl,
      siteName: "HatComics",
      type: "article",
      publishedTime: roadmap.createdAt.toISOString(),
      modifiedTime: roadmap.updatedAt?.toISOString(),
      images: [
        {
          url: roadmap.image || `${baseUrl}/default-og-image.jpg`,
          width: 1280,
          height: 720,
          alt: roadmap.title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: roadmap.title,
      description: plainTextContent,
      images: [roadmap.image || `${baseUrl}/default-og-image.jpg`],
    },

    // Additional SEO
    keywords: extractKeywords(roadmap.description || "", roadmap.title),
    alternates: {
      canonical: roadmapUrl,
    },

    // JSON-LD structured data
    other: {
      "article:published_time": roadmap.createdAt.toISOString(),
      "article:modified_time":
        roadmap.updatedAt?.toISOString() || roadmap.createdAt.toISOString(),
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

  const roadmap = await prisma.roadmap.findFirst({
    where: { id },
  });

  if (!roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4">
            roadmap Not Found
          </h1>
          <p className="text-zinc-400">
            The roadmap you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RoadmapPageClient />
    </>
  );
};

export default page;
