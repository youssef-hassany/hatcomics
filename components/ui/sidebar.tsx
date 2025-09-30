"use client";

import { useState } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import {
  Menu,
  X,
  Home,
  Users,
  Info,
  BookOpen,
  Star,
  Newspaper,
  User,
  Trophy,
  Library,
  Coffee,
  Map,
  Bell,
} from "lucide-react";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useGetNotificationsCount } from "@/hooks/notifications/useGetNotificationsCount";

export default function Sidebar() {
  const { data: user } = useGetLoggedInUser();
  const { data: notificationsCount } = useGetNotificationsCount();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    {
      title: "Home",
      url: "/home",
      icon: (
        <Home
          size={20}
          className="group-hover:text-orange-500 transition-colors"
        />
      ),
    },
    {
      title: "Comics",
      url: "/comics",
      icon: (
        <BookOpen
          size={20}
          className="group-hover:text-orange-500 transition-colors"
        />
      ),
    },
    {
      title: "Reviews",
      url: "/reviews",
      icon: (
        <Star
          size={20}
          className="group-hover:text-orange-500 transition-colors"
        />
      ),
    },
    {
      title: "Book Clubs",
      url: "/book-club",
      icon: (
        <Coffee
          size={20}
          className="group-hover:text-orange-500 transition-colors"
        />
      ),
    },
    {
      title: "Posts",
      url: "/posts",
      icon: (
        <Newspaper
          size={20}
          className="group-hover:text-orange-500 transition-colors"
        />
      ),
    },
    {
      title: "Roadmaps",
      url: "/roadmaps",
      icon: (
        <Map
          size={20}
          className="group-hover:text-orange-500 transition-colors"
        />
      ),
    },
    {
      title: "Readlist",
      url: `/readlist/${user?.id}`,
      icon: (
        <Library
          size={20}
          className="group-hover:text-orange-500 transition-colors"
        />
      ),
    },
    {
      title: "Profile",
      url: `/profile/${user?.username}`,
      icon: (
        <User
          size={20}
          className="group-hover:text-orange-500 transition-colors"
        />
      ),
    },
    {
      title: "Notifications",
      url: `/notifications`,
      icon: (
        <Bell
          size={20}
          className="group-hover:text-orange-500 transition-colors"
        />
      ),
      count: notificationsCount,
    },
    {
      title: "Community",
      url: "/community",
      icon: (
        <Users
          size={20}
          className="group-hover:text-orange-500 transition-colors"
        />
      ),
    },
    {
      title: "Top Users",
      url: `/top-users`,
      icon: (
        <Trophy
          size={20}
          className="group-hover:text-orange-500 transition-colors"
        />
      ),
    },
    // {
    //   title: "Settings",
    //   url: `/settings`,
    //   icon: (
    //     <Settings
    //       size={20}
    //       className="group-hover:text-orange-500 transition-colors"
    //     />
    //   ),
    // },
    {
      title: "About",
      url: `/about`,
      icon: (
        <Info
          size={20}
          className="group-hover:text-orange-500 transition-colors"
        />
      ),
    },
  ];

  // Function to check if a link is active
  const isActive = (url: string) => {
    if (url === "/home") {
      return pathname === "/home" || pathname === "/";
    }
    // For profile links, check if pathname starts with /profile
    if (url.startsWith("/profile/")) {
      return pathname.startsWith("/profile/");
    }
    return pathname === url;
  };

  return (
    <>
      {/* Top Header for signed out users */}
      <SignedOut>
        <header>
          <nav className="fixed top-0 w-full bg-zinc-900/95 backdrop-blur-sm z-50 border-b border-zinc-700">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/hatcomics-logo.png"
                    width={48}
                    height={48}
                    className="w-12 h-12"
                    alt="HatComics"
                  />
                  <span className="text-xl font-bold text-white">
                    HatComics
                  </span>
                </div>

                <div className="hidden md:flex space-x-8">
                  <Link
                    href="#features"
                    className="text-zinc-300 hover:text-orange-500 transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="#community"
                    className="text-zinc-300 hover:text-orange-500 transition-colors"
                  >
                    Community
                  </Link>
                  <Link
                    href="#about"
                    className="text-zinc-300 hover:text-orange-500 transition-colors"
                  >
                    About
                  </Link>
                </div>

                <div className="flex space-x-3">
                  <button className="px-4 py-2 border border-zinc-600 text-zinc-300 rounded-lg hover:border-zinc-500 hover:text-white transition-colors">
                    <SignInButton />
                  </button>

                  <button className="px-4 py-2 bg-orange-500 text-zinc-900 rounded-lg hover:bg-orange-400 transition-colors font-semibold">
                    <SignUpButton />
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </header>
      </SignedOut>

      {/* Sidebar for signed in users */}
      <SignedIn>
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 md:hidden p-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 h-full w-64 bg-zinc-900 border-r border-zinc-700 z-50 transform transition-transform duration-200 ease-in-out overflow-y-scroll no-scrollbar ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div className="flex flex-col h-full">
            {/* Logo section */}
            <div className="flex items-center space-x-3 p-6 border-b border-zinc-700">
              <Image
                src="/hatcomics-logo.png"
                width={48}
                height={48}
                className="w-12 h-12"
                alt="HatComics"
              />
              <span className="text-xl font-bold text-white">HatComics</span>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-4 py-6">
              <div className="space-y-2">
                {links.map((link, idx) => {
                  const active = isActive(link.url);
                  return (
                    <Link
                      key={idx}
                      onClick={() => setSidebarOpen(false)}
                      href={link.url}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all group ${
                        active
                          ? "bg-orange-500/10 text-orange-500 border-r-2 border-orange-500"
                          : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                      }`}
                    >
                      {/* Left side (icon + title) */}
                      <div className="flex items-center space-x-3">
                        <span className={active ? "text-orange-500" : ""}>
                          {link.icon}
                        </span>
                        <span className={active ? "font-medium" : ""}>
                          {link.title}
                        </span>
                      </div>

                      {/* Right side (count badge) */}
                      {link.count && link.count > 0 && (
                        <span className="ml-auto rounded-full bg-orange-600 px-2 py-0.5 text-xs font-medium text-white">
                          {link.count > 99 ? "99+" : link.count}
                        </span>
                      )}
                    </Link>
                  );
                })}

                {(user?.role === "owner" || user?.role === "admin") && (
                  <Link
                    onClick={() => setSidebarOpen(false)}
                    href="/comic-vine"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all group ${
                      isActive("/comic-vine")
                        ? "bg-orange-500/10 text-orange-500 border-r-2 border-orange-500"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                    }`}
                  >
                    <span
                      className={
                        isActive("/comic-vine") ? "text-orange-500" : ""
                      }
                    >
                      <BookOpen
                        size={20}
                        className="group-hover:text-orange-500 transition-colors"
                      />
                    </span>
                    <span
                      className={isActive("/comic-vine") ? "font-medium" : ""}
                    >
                      Comic Vine
                    </span>
                  </Link>
                )}
              </div>
            </nav>

            {/* User section at bottom */}
            <div className="p-4 border-t border-zinc-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">{user?.username}</span>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </aside>
      </SignedIn>
    </>
  );
}
