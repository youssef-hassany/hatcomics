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
    <Link href={`/profile/${username}`}>
      <Image
        src={url}
        height={height}
        width={width}
        alt={username}
        className={`w-10 h-10 rounded-full cursor-pointer ${className}`}
      />
    </Link>
  );
};

export default Avatar;
