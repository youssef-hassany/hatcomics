import { useGetReadlist } from "@/hooks/readlist/useGetReadList";
import React from "react";
import ComicCard from "../comics/ComicCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  userId: string;
}

const UserReadList = ({ userId }: Props) => {
  const { data, isPending } = useGetReadlist(userId);
  const comics = data?.slice(0, 5);
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-modern">
      {comics?.map((comic) => (
        <div key={comic.id} className="flex-shrink-0 w-56">
          <ComicCard comic={comic.comic} />
        </div>
      ))}

      {isPending && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-44 bg-zinc-800 rounded-xl h-96 animate-pulse border border-zinc-700"
            />
          ))}
        </div>
      )}

      {data && data.length > 5 && (
        <Link
          href={`/readlist/${userId}`}
          className="flex-shrink-0 group w-32 h-32 bg-gradient-to-br from-zinc-500 to-zinc-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full flex flex-col justify-center items-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg border border-zinc-400/20"
        >
          <span className="text-sm font-medium">See More</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      )}
    </div>
  );
};

export default UserReadList;
