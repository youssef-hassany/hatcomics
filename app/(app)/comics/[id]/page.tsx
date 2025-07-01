"use client";

import { useGetComicVineComicById } from "@/hooks/comic-vine/useGetComicVineComicById";
import { useParams } from "next/navigation";
import React from "react";

const Comic = () => {
  const { id } = useParams();

  // @ts-expect-error: useGetComicVineComicById expects a string, but id may be undefined
  useGetComicVineComicById(id);

  return <div>Comic</div>;
};

export default Comic;
