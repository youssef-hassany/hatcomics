import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { BookOpen, Newspaper, Star, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const HomePage = async () => {
  const { userId } = await auth();
  const user = await prisma.user.findUnique({ where: { clerkId: userId! } });

  const pages = [
    {
      name: "Blogs",
      route: "/blogs",
      icon: <Newspaper />,
      description:
        "Read the latest articles, insights, and stories from the comic book world",
    },
    {
      name: "Comics Reviews",
      route: "/reviews",
      icon: <Star />,
      description:
        "Discover honest reviews and ratings of the newest comic releases",
    },
    {
      name: "Comics Recommendations",
      route: "/recommendations",
      icon: <BookOpen />,
      description:
        "Get personalized comic suggestions based on your interests and reading history",
    },
    {
      name: "Community",
      route: "/community",
      icon: <Users />,
      description:
        "Connect with fellow comic enthusiasts and join engaging discussions",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-zinc-100">
            Hello, {user?.username}
          </h1>
          <p className="text-zinc-400">What would you like to explore today?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {pages.map((page, index) => (
            <Link
              href={page.route}
              key={index}
              className="group p-6 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-orange-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                  {page.icon}
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-orange-300 transform group-hover:translate-x-1 transition-all" />
              </div>

              <h3 className="text-xl font-semibold mb-3 text-zinc-100">
                {page.name}
              </h3>

              <p className="text-zinc-400 text-sm leading-relaxed">
                {page.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
