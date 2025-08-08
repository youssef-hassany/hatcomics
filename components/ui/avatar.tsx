import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  username: string;
  width?: number;
  height?: number;
  className?: string;
  url: string;
}

const Avatar = ({
  width = 40,
  height = 40,
  url,
  username,
  className,
}: Props) => {
  return (
    <Link href={`/profile/${username}`} className="flex-shrink-0">
      <Image
        src={url}
        height={height}
        width={width}
        alt={username}
        className={`w-20 h-20 rounded-full cursor-pointer object-cover ${className}`}
      />
    </Link>
  );
};

export default Avatar;
