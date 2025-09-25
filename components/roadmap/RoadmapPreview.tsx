import Link from "next/link";
import Image from "next/image";
import { User, Calendar, MessageCircle, Heart, MapPin } from "lucide-react";
import { RoadmapPreviewType } from "@/types/Roadmap";
import { getTimeAgo } from "@/lib/date";

interface RoadmapPreviewProps {
  roadmap: RoadmapPreviewType;
  isDraft?: boolean;
}

export function RoadmapPreviewCard({
  roadmap,
  isDraft = false,
}: RoadmapPreviewProps) {
  return (
    <Link
      href={
        isDraft ? `/roadmaps/${roadmap.id}/manage` : `/roadmaps/${roadmap.id}`
      }
      className="group block bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-1"
    >
      {/* Cover Image */}
      <div className="relative w-full h-48 bg-zinc-800 overflow-hidden">
        {roadmap.image ? (
          <img
            src={roadmap.image}
            alt={roadmap.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <MapPin className="w-16 h-16 text-zinc-600" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-semibold text-zinc-100 mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
          {roadmap.title}
        </h3>

        {/* Description */}
        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none prose-zinc rich-text-editor">
          <p
            className="text-zinc-400 text-sm mb-4 line-clamp-3 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: roadmap.description }}
          />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span>{roadmap._count.comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>{roadmap._count.likes}</span>
          </div>
        </div>

        {/* Creator Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700">
              {roadmap.creator.photo ? (
                <Image
                  src={roadmap.creator.photo}
                  alt={roadmap.creator.fullname}
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Creator Details */}
            <div>
              <p className="text-sm font-medium text-zinc-300">
                {roadmap.creator.fullname}
              </p>
              <p className="text-xs text-zinc-500">
                @{roadmap.creator.username}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <Calendar className="w-3 h-3" />
            <span>{getTimeAgo(roadmap.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
