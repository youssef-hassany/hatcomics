import { CommentsSection } from "@/components/comments";
import ComponentProtector from "@/components/common/ComponentProtector";
import LikeHandler from "@/components/common/LikeHandler";
import ShareButton from "@/components/common/ShareButton";
import ListItems from "@/components/lists/ListItems";
import PageHeader from "@/components/ui/PageHeader";
import { listService } from "@/services/list.service";
import { userService } from "@/services/user.service";
import { auth } from "@clerk/nextjs/server";
import { List, Pencil } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
};

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const list = await listService.getList(id);

  if (!list) {
    return {
      title: "List Not Found",
      description: "The requested list could not be found.",
    };
  }

  // Extract plain text from HTML content for description
  const plainTextContent = list.title;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hat-comics.com";
  const listUrl = `${baseUrl}/lists/${id}`;

  return {
    title: `${list.title} | HatComics - Comic Reviews & Discussion`,
    description: plainTextContent,
    authors: [{ name: list.creator.fullname }],

    // Open Graph for social sharing
    openGraph: {
      title: list.title as string,
      description: plainTextContent,
      url: listUrl,
      siteName: "HatComics",
      type: "article",
      publishedTime: list.createdAt.toISOString(),
      modifiedTime: list.updatedAt?.toISOString(),
      authors: [list.creator.fullname],
      images: [
        {
          url: list.image || `${baseUrl}/hatcomics.png`,
          width: 1080,
          height: 1750,
          alt: list.title as string,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: list.title as string,
      description: plainTextContent,
      creator: `@${list.creator.username || list.creator.fullname}`,
      images: [list.image || `${baseUrl}/hatcomics.png`],
    },

    // JSON-LD structured data
    other: {
      "article:author": list.creator.fullname,
      "article:published_time": list.createdAt.toISOString(),
      "article:modified_time":
        list.updatedAt?.toISOString() || list.createdAt.toISOString(),
    },
  };
}

const ListPage = async ({ params }: Props) => {
  const { userId } = await auth();
  const visitor = await userService.getUserById(userId!);

  const { id } = await params;
  const list = await listService.getList(id, userId!);

  return (
    <div className="relative min-h-screen bg-zinc-900">
      <PageHeader
        Icon={List}
        title={list.title}
        description={`Created By: ${list.creator.fullname}`}
      />

      <ListItems items={list.entries} type={list.type} />

      <div className="absolute top-3 right-3 flex flex-col items-end gap-4">
        <ShareButton
          contentPublisher={list.creator.fullname}
          contentTitle={list.title}
          contentType="list"
        />

        {list.createdBy === visitor?.id && (
          <Link
            href={`/lists/${list.id}/manage`}
            className="group relative inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-700/50 hover:border-orange-500/50 transition-all duration-300 hover:bg-orange-500/10 cursor-pointer"
            title="Share"
          >
            <Pencil className="w-4 h-4 text-zinc-400 group-hover:text-orange-400 transition-colors duration-300" />
            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors duration-300 hidden sm:inline">
              Manage
            </span>
          </Link>
        )}
      </div>

      <ComponentProtector>
        <div className="absolute top-48 md:top-40 left-4">
          <LikeHandler
            contentId={list.id}
            contentType="list"
            isLikedByCurrentUser={list.isLikedByCurrentUser}
            likesInitialCount={list._count.likes}
          />
        </div>
      </ComponentProtector>

      {list && <CommentsSection referenceId={list.id} type="list" />}
    </div>
  );
};

export default ListPage;
