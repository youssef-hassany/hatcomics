"use client";

import NotAuthorized from "@/components/common/NotAuthorized";
import { useGetStats } from "@/hooks/stats/useGetStats";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import { Newspaper, Stars, Users } from "lucide-react";
import React from "react";

const StatsPage = () => {
  const { data: user, isLoading } = useGetLoggedInUser();
  const { data: stats } = useGetStats();

  console.log(stats);

  if (isLoading) {
    return <>Loading...</>;
  }

  if (user?.role !== "owner") {
    return <NotAuthorized />;
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-zinc-100">
            Hello, {user?.username}
          </h1>
          <p className="text-zinc-400">Here is HatComics Stats For Today</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="group p-6 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-orange-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                <Users />
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-zinc-100">Users</h3>

            <p className="text-zinc-400 text-xl font-extrabold leading-relaxed">
              {stats?.usersNum}
            </p>
          </div>

          <div className="group p-6 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-orange-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                <Stars />
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-zinc-100">
              Reviews
            </h3>

            <p className="text-zinc-400 text-smxl font-extrabold leading-relaxed">
              {stats?.reviewsNum}
            </p>
          </div>

          <div className="group p-6 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-orange-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                <Newspaper />
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-zinc-100">Posts</h3>

            <p className="text-zinc-400 text-xl font-extrabold leading-relaxed">
              {stats?.postsNum}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
