"use client";

import {
  Clock,
  User,
  BookOpen,
  Users,
  Star,
  ExternalLink,
  Pencil,
  Plus,
} from "lucide-react";
import { ComicPreview } from "@/types/Comic";
import { useGetComic } from "@/hooks/comics/useGetComic";
import ComicContentSkeleton from "./ComicContentSkeleton";
import { useState } from "react";
import { Modal } from "../ui/modal";
import UpdateComicForm from "./UpdateComicForm";
import { Button } from "../ui/button";
import AddReadingLinkForm from "./AddReadingLinkForm";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import { ReadlistToggleButton } from "./ReadlistToggleButton";

interface ComicContentProps {
  initialComic: ComicPreview;
}

const ComicContent = ({ initialComic }: ComicContentProps) => {
  const { data: comic, isPending } = useGetComic(initialComic.id);
  const { data: user } = useGetLoggedInUser();

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isAddReadingLinkOpen, setIsAddReadingLinkOpen] = useState(false);

  const currentComic = comic || initialComic;
  const isUserAccessible =
    user?.role === "admin" ||
    user?.role === "translator" ||
    user?.role === "owner";
  const isUserAdmin = user?.role === "admin" || user?.role === "owner";

  if (isPending && !initialComic) {
    return <ComicContentSkeleton />;
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header Section */}
      <div className="bg-zinc-900 border-b border-zinc-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Comic Cover */}
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] relative overflow-hidden rounded-xl border border-zinc-800 shadow-2xl">
                <img
                  src={currentComic.image || "/placeholder-comic.jpg"}
                  alt={currentComic.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-4 my-3">
                {isUserAdmin && (
                  <Button
                    variant="secondary"
                    onClick={() => setIsUpdateOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Pencil size={16} />
                    <span>Edit Comic</span>
                  </Button>
                )}

                {isUserAccessible && (
                  <Button
                    onClick={() => setIsAddReadingLinkOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus size={16} />
                    <span>Add Link</span>
                  </Button>
                )}

                {comic && user && (
                  <ReadlistToggleButton
                    comicId={comic?.id}
                    userId={user?.id}
                    isInReadlist={comic.isInReadlist}
                  />
                )}
              </div>
            </div>

            {/* Comic Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-zinc-100 mb-4">
                    {currentComic.name}
                  </h1>

                  {/* Rating */}
                  {currentComic.averageRating && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-orange-400 fill-current" />
                        <span className="text-xl font-semibold text-zinc-100">
                          {currentComic.averageRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-zinc-400">
                        ({currentComic.totalReviews} review
                        {currentComic.totalReviews !== 1 ? "s" : ""})
                      </span>
                    </div>
                  )}

                  {/* Beginner Friendly Badge */}
                  {currentComic.isBeginnerFriendly && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-900/30 border border-green-700 text-green-300 text-sm font-medium mb-4">
                      Beginner Friendly
                    </div>
                  )}
                </div>
              </div>

              {/* Comic Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-zinc-300">
                    <User className="w-5 h-5 text-zinc-500" />
                    <div>
                      <span className="text-zinc-500 text-sm">Publisher</span>
                      <p className="font-medium">{currentComic.publisher}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-zinc-300">
                    <Users className="w-5 h-5 text-zinc-500" />
                    <div>
                      <span className="text-zinc-500 text-sm">Authors</span>
                      <p className="font-medium">
                        {currentComic.authors.map((author, idx) => (
                          <span className="block" key={idx}>
                            {author}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-zinc-300">
                    <BookOpen className="w-5 h-5 text-zinc-500" />
                    <div>
                      <span className="text-zinc-500 text-sm">Issues</span>
                      <p className="font-medium">
                        {currentComic.numberOfIssues}
                        {currentComic.ongoing && "+ (Ongoing)"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-zinc-300">
                    <Clock className="w-5 h-5 text-zinc-500" />
                    <div>
                      <span className="text-zinc-500 text-sm">Added</span>
                      <p className="font-medium">
                        {new Date(currentComic.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Characters */}
              {currentComic.characters && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                    Characters
                  </h3>
                  <p className="text-zinc-300">
                    {currentComic.characters.map((char, idx) => (
                      <span className="mr-2" key={(idx + 1) * 100}>
                        {char}
                      </span>
                    ))}
                  </p>
                </div>
              )}

              {/* Reading Links */}
              {currentComic.readingLinks &&
                currentComic.readingLinks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-zinc-100 mb-3">
                      Where to Read
                    </h3>
                    <div className="flex flex-col flex-wrap gap-3">
                      {currentComic.readingLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-600 flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {link.length > 50 ? `${link.slice(0, 50)}...` : link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              {/* Description Section */}
              {currentComic.description && (
                <div className="mt-8 pt-8 border-t border-zinc-800">
                  <h2 className="text-2xl font-bold text-zinc-100 mb-6">
                    Description
                  </h2>

                  <div
                    className="prose prose-lg prose-invert max-w-none
                      prose-headings:text-zinc-100 prose-headings:font-bold
                      prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0
                      prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
                      prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
                      prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-6
                      prose-a:text-orange-400 prose-a:no-underline hover:prose-a:text-orange-300 hover:prose-a:underline
                      prose-strong:text-zinc-100 prose-strong:font-semibold
                      prose-code:bg-zinc-800 prose-code:text-orange-300 prose-code:px-2 prose-code:py-1 prose-code:rounded
                      prose-pre:bg-zinc-950 prose-pre:text-zinc-100 prose-pre:border prose-pre:border-zinc-800
                      prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-zinc-400
                      prose-ul:mb-6 prose-ol:mb-6
                      prose-li:mb-2 prose-li:text-zinc-300
                      prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:border prose-img:border-zinc-800 rich-text-editor"
                    dangerouslySetInnerHTML={{
                      __html: currentComic.description,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {comic && isUserAdmin && (
        <Modal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)}>
          <UpdateComicForm
            comic={comic}
            onSuccess={() => setIsUpdateOpen(false)}
            onCancel={() => setIsUpdateOpen(false)}
          />
        </Modal>
      )}

      {comic && isUserAccessible && (
        <Modal
          isOpen={isAddReadingLinkOpen}
          onClose={() => setIsAddReadingLinkOpen(false)}
        >
          <AddReadingLinkForm
            comicId={comic.id}
            onSuccess={() => setIsAddReadingLinkOpen(false)}
            onCancel={() => setIsAddReadingLinkOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default ComicContent;
