"use client";

import NotAuthorized from "@/components/common/NotAuthorized";
import AddComicToRoadmapForm from "@/components/roadmap/AddComicToRoadmapForm";
import { useGetRoadmapDetails } from "@/hooks/roadmaps/useGetRoadmapDetails";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import { useParams } from "next/navigation";
import React from "react";

const AddComicToRoadmapPage = () => {
  const { id: roadmapId } = useParams();
  const { data: roadmapData, isLoading: roadmapLoading } = useGetRoadmapDetails(
    roadmapId as string
  );
  const { data: loggedInUser, isLoading: userLoading } = useGetLoggedInUser();

  if (
    !userLoading &&
    !roadmapLoading &&
    roadmapData?.creator.id !== loggedInUser?.id
  ) {
    return <NotAuthorized />;
  }

  return (
    <div>
      <AddComicToRoadmapForm />
    </div>
  );
};

export default AddComicToRoadmapPage;
