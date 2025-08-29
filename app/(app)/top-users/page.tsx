"use client";

import React from "react";
import { useGetTopUsers } from "@/hooks/user/useGetTopUsers";
import Avatar from "@/components/ui/avatar";

const TopUsersPage = () => {
  const { data: users, isLoading, error } = useGetTopUsers();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-zinc-700 border-t-orange-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-orange-500 opacity-20"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl md:text-6xl mb-4">💥</div>
          <div className="text-zinc-300 text-lg md:text-xl font-bold">
            OOPS! Something went wrong!
          </div>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl md:text-6xl mb-4">🦸‍♂️</div>
          <div className="text-zinc-300 text-lg md:text-xl font-bold">
            No heroes found yet!
          </div>
        </div>
      </div>
    );
  }

  const topThree = users.slice(0, 3);
  const remaining = users.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-6 md:py-12 px-4 relative overflow-hidden">
      {/* Comic book background effects - hidden on mobile */}
      <div className="absolute inset-0 opacity-5 hidden md:block">
        <div className="absolute top-20 left-10 text-6xl animate-pulse">💥</div>
        <div className="absolute top-40 right-20 text-4xl animate-bounce">
          ⚡
        </div>
        <div className="absolute bottom-40 left-20 text-5xl animate-pulse">
          🌟
        </div>
        <div className="absolute bottom-20 right-10 text-3xl animate-bounce">
          💫
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <div className="relative inline-block">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 mb-4 transform -skew-x-12 shadow-lg">
              TOP HEROES
            </h1>
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-xl -z-10 transform -skew-x-12"></div>
          </div>
          <p className="text-zinc-300 text-sm sm:text-base md:text-xl font-bold uppercase tracking-wider">
            🦸‍♂️ LEGENDARY COMIC COLLECTORS 🦸‍♀️
          </p>
        </div>

        {/* Top 3 Users - Responsive Layout */}
        <div className="mb-12 md:mb-20">
          {/* Mobile: Stack vertically */}
          <div className="block md:hidden space-y-8">
            {topThree.map((user, index) => (
              <div
                key={user.id}
                className="flex flex-col items-center transform hover:scale-105 transition-all duration-300"
              >
                <div className="relative mb-4">
                  <div
                    className={`absolute -inset-3 rounded-full blur-md animate-pulse ${
                      index === 0
                        ? "bg-gradient-to-r from-orange-400 via-orange-500 to-red-500"
                        : index === 1
                        ? "bg-gradient-to-r from-zinc-600 to-zinc-500"
                        : "bg-gradient-to-r from-zinc-700 to-zinc-600"
                    }`}
                  ></div>
                  <Avatar
                    username={user.username}
                    url={user.photo}
                    width={80}
                    height={80}
                    className={`w-20 h-20 relative z-10 border-4 shadow-2xl ${
                      index === 0
                        ? "ring-4 ring-orange-400 border-yellow-300"
                        : index === 1
                        ? "ring-4 ring-zinc-400 border-white"
                        : "ring-4 ring-zinc-500 border-white"
                    }`}
                  />
                  <div
                    className={`absolute -top-3 -right-3 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-black shadow-lg border-2 border-white transform ${
                      index === 0
                        ? "bg-gradient-to-r from-orange-500 to-red-500 rotate-12 animate-pulse"
                        : index === 1
                        ? "bg-gradient-to-r from-zinc-600 to-zinc-700 rotate-12"
                        : "bg-gradient-to-r from-zinc-700 to-zinc-800 -rotate-12"
                    }`}
                  >
                    {index === 0 ? "👑" : index + 1}
                  </div>
                  <div
                    className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce ${
                      index === 0 ? "🏆" : index === 1 ? "🥈" : "🥉"
                    }`}
                  ></div>
                </div>
                <div
                  className={`rounded-2xl p-6 text-center border-4 shadow-2xl comic-border w-full max-w-sm ${
                    index === 0
                      ? "bg-gradient-to-br from-orange-600 via-orange-700 to-red-700 border-yellow-400 champion-glow"
                      : index === 1
                      ? "bg-gradient-to-br from-zinc-700 to-zinc-800 border-zinc-500"
                      : "bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-600"
                  }`}
                >
                  <h3
                    className={`font-black text-lg mb-2 uppercase ${
                      index === 0 ? "text-yellow-100" : "text-white"
                    }`}
                  >
                    {user.fullname}
                  </h3>
                  <p
                    className={`text-sm mb-4 font-bold ${
                      index === 0
                        ? "text-orange-200"
                        : index === 1
                        ? "text-zinc-300"
                        : "text-zinc-400"
                    }`}
                  >
                    @{user.username}
                  </p>
                  <div
                    className={`text-white px-4 py-2 rounded-full text-sm font-black uppercase shadow-lg border-2 comic-bubble ${
                      index === 0
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-orange-800 border-yellow-200"
                        : "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-300"
                    }`}
                  >
                    {index === 0 ? "🔥" : index === 1 ? "💪" : "⚡"}{" "}
                    {user.points.toLocaleString()} PTS {index === 0 ? "🔥" : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Podium style */}
          <div className="hidden md:flex items-end justify-center gap-4 lg:gap-8 mb-8">
            {/* Second Place */}
            {topThree[1] && (
              <div className="flex flex-col items-center transform hover:scale-105 transition-all duration-300">
                <div className="relative mb-6">
                  <div className="absolute -inset-3 bg-gradient-to-r from-zinc-600 to-zinc-500 rounded-full blur-md animate-pulse"></div>
                  <Avatar
                    username={topThree[1].username}
                    url={topThree[1].photo}
                    width={80}
                    height={80}
                    className="w-20 h-20 ring-4 ring-zinc-400 relative z-10 border-4 border-white shadow-2xl"
                  />

                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-3xl animate-bounce">
                    🥈
                  </div>
                </div>
                <div className="bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-2xl p-4 lg:p-6 text-center border-4 border-zinc-500 shadow-2xl transform -rotate-2 hover:rotate-0 transition-all duration-300 comic-border">
                  <h3 className="text-white font-black text-base lg:text-lg mb-2 uppercase">
                    {topThree[1].fullname}
                  </h3>
                  <p className="text-zinc-300 text-xs lg:text-sm mb-4 font-bold">
                    @{topThree[1].username}
                  </p>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-black uppercase shadow-lg border-2 border-orange-300 comic-bubble">
                    💪 {topThree[1].points.toLocaleString()} PTS
                  </div>
                </div>
              </div>
            )}

            {/* First Place - THE CHAMPION */}
            {topThree[0] && (
              <div className="flex flex-col items-center transform hover:scale-110 transition-all duration-300">
                <div className="relative mb-6">
                  <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 rounded-full blur-lg animate-pulse"></div>
                  <Avatar
                    username={topThree[0].username}
                    url={topThree[0].photo}
                    width={100}
                    height={100}
                    className="w-25 h-25 ring-4 ring-orange-400 relative z-10 border-4 border-yellow-300 shadow-2xl"
                  />
                  <div className="absolute -top-6 -right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full w-14 lg:w-16 h-14 lg:h-16 flex items-center justify-center text-lg lg:text-xl font-black shadow-xl border-4 border-yellow-300 transform rotate-12 animate-pulse">
                    👑 1st
                  </div>
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce">
                    🏆
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-600 via-orange-700 to-red-700 rounded-2xl p-6 lg:p-8 text-center border-4 border-yellow-400 shadow-2xl transform hover:rotate-0 transition-all duration-500 comic-border champion-glow">
                  <h3 className="text-yellow-100 font-black text-xl lg:text-2xl mb-2 uppercase tracking-wide">
                    {topThree[0].fullname}
                  </h3>
                  <p className="text-orange-200 text-sm mb-4 font-bold">
                    @{topThree[0].username}
                  </p>
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-orange-800 px-4 lg:px-6 py-3 rounded-full text-base lg:text-lg font-black uppercase shadow-xl border-2 border-yellow-200 comic-bubble">
                    🔥 {topThree[0].points.toLocaleString()} PTS 🔥
                  </div>
                </div>
              </div>
            )}

            {/* Third Place */}
            {topThree[2] && (
              <div className="flex flex-col items-center transform hover:scale-105 transition-all duration-300">
                <div className="relative mb-6">
                  <div className="absolute -inset-3 bg-gradient-to-r from-amber-700 to-amber-600 rounded-full blur-md animate-pulse"></div>
                  <Avatar
                    username={topThree[2].username}
                    url={topThree[2].photo}
                    width={70}
                    height={70}
                    className="w-[70px] h-[70px] ring-4 ring-amber-500 relative z-10 border-4 border-white shadow-2xl"
                  />

                  <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-3xl animate-bounce">
                    🥉
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-800 to-amber-900 rounded-2xl p-4 lg:p-5 text-center border-4 border-amber-600 shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-300 comic-border">
                  <h3 className="text-white font-black mb-2 uppercase text-base lg:text-lg">
                    {topThree[2].fullname}
                  </h3>
                  <p className="text-amber-400 text-xs lg:text-sm mb-3 font-bold">
                    @{topThree[2].username}
                  </p>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-2 rounded-full text-xs lg:text-sm font-black uppercase shadow-lg border-2 border-orange-300 comic-bubble">
                    ⚡ {topThree[2].points.toLocaleString()} PTS
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Remaining Users - Responsive Cards */}
        {remaining.length > 0 && (
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center mb-8 md:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 uppercase transform -skew-x-6">
              🦸‍♀️ RISING HEROES 🦸‍♂️
            </h2>
            <div className="flex flex-col space-y-4 md:space-y-6 max-w-4xl mx-auto">
              {remaining.map((user, index) => (
                <div
                  key={user.id}
                  className={`bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-xl p-4 md:p-6 border-4 border-zinc-600 shadow-xl hover:shadow-2xl hover:border-orange-500 transition-all duration-300 transform hover:-translate-y-2 comic-border ${
                    index % 2 === 0 ? "hover:rotate-1" : "hover:-rotate-1"
                  }`}
                >
                  <div className="flex items-center space-x-4 md:space-x-6">
                    <div className="relative flex-shrink-0">
                      <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-full blur-sm"></div>
                      <Avatar
                        username={user.username}
                        url={user.photo}
                        width={50}
                        height={50}
                        className="w-12 md:w-15 h-12 md:h-15 relative z-10 border-4 border-white shadow-lg"
                      />
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full w-6 md:w-8 h-6 md:h-8 flex items-center justify-center text-xs md:text-sm font-black shadow-lg border-2 border-white transform rotate-12">
                        #{index + 4}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-black text-lg md:text-xl uppercase mb-1 truncate">
                        {user.fullname}
                      </h3>
                      <p className="text-zinc-300 font-bold text-sm md:text-base truncate">
                        @{user.username}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-full font-black uppercase shadow-lg border-2 border-orange-300 comic-bubble text-sm md:text-lg">
                        💥 {user.points.toLocaleString()} PTS
                      </div>
                      <div className="text-zinc-400 text-xs md:text-sm font-bold mt-2 uppercase">
                        Rank #{index + 4}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .comic-border {
          box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.3),
            inset 0 0 0 2px rgba(255, 255, 255, 0.1);
        }

        .comic-bubble {
          box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
        }

        .champion-glow {
          animation: champion-glow 2s ease-in-out infinite alternate;
        }

        @keyframes champion-glow {
          from {
            box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.3),
              0 0 20px rgba(255, 165, 0, 0.5);
          }
          to {
            box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.3),
              0 0 40px rgba(255, 165, 0, 0.8);
          }
        }
      `}</style>
    </div>
  );
};

export default TopUsersPage;
