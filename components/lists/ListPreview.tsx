import React from "react";
import Avatar from "../ui/avatar";
import Link from "next/link";

interface Props {
  title: string;
  image: string;
  user: {
    fullname: string;
    photo: string;
    username: string;
  };
  url: string;
}

const ListPreview = ({ image, title, user, url }: Props) => {
  return (
    <Link href={url} className="group relative cursor-pointer">
      {/* Card Container */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg group-hover:shadow-orange-500/20 transition-all duration-500 group-hover:border-orange-500/50 group-hover:-translate-y-2">
        {/* Image */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-100 transition-all duration-500">
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 mb-2 drop-shadow-lg">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-orange-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span>
              <Avatar
                url={user.photo}
                username={user.username}
                className="w-6 h-6"
              />
              <span>@{user.username}</span>
            </div>
          </div>
        </div>

        {/* Shimmer Effect on Hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>
    </Link>
  );
};

export default ListPreview;
