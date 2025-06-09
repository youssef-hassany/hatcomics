import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AuthRedirect = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = await auth();

  if (userId) redirect("/home");

  return <>{children}</>;
};

export default AuthRedirect;
