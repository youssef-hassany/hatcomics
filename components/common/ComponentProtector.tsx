import { useAuth } from "@clerk/nextjs";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const ComponentProtector = ({ children }: Props) => {
  const { userId } = useAuth();

  if (!userId) return;

  return <>{children}</>;
};

export default ComponentProtector;
