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
  Settings,
  Newspaper,
  User,
} from "lucide-react";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import Link from "next/link";

export default function Sidebar() {
  const { data: user } = useGetLoggedInUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Top Header for signed out users */}
      <SignedOut>
        <header>
          <nav className="fixed top-0 w-full bg-zinc-900/95 backdrop-blur-sm z-50 border-b border-zinc-700">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-zinc-900">
                    H
                  </div>
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
          className={`fixed left-0 top-0 h-full w-64 bg-zinc-900 border-r border-zinc-700 z-50 transform transition-transform duration-200 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div className="flex flex-col h-full">
            {/* Logo section */}
            <div className="flex items-center space-x-3 p-6 border-b border-zinc-700">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">HatComics</span>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-4 py-6">
              <div className="space-y-2">
                <Link
                  href="/home"
                  className="flex items-center space-x-3 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors group"
                >
                  <Home
                    size={20}
                    className="group-hover:text-orange-500 transition-colors"
                  />
                  <span>Home</span>
                </Link>

                <Link
                  href="/comics"
                  className="flex items-center space-x-3 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors group"
                >
                  <BookOpen
                    size={20}
                    className="group-hover:text-orange-500 transition-colors"
                  />
                  <span>Comics</span>
                </Link>

                <Link
                  href="/community"
                  className="flex items-center space-x-3 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors group"
                >
                  <Users
                    size={20}
                    className="group-hover:text-orange-500 transition-colors"
                  />
                  <span>Community</span>
                </Link>

                <Link
                  href="/reviews"
                  className="flex items-center space-x-3 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors group"
                >
                  <Star
                    size={20}
                    className="group-hover:text-orange-500 transition-colors"
                  />
                  <span>Reviews</span>
                </Link>

                <Link
                  href="/posts"
                  className="flex items-center space-x-3 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors group"
                >
                  <Newspaper
                    size={20}
                    className="group-hover:text-orange-500 transition-colors"
                  />
                  <span>Posts</span>
                </Link>

                <Link
                  href={`/profile/${user?.username}`}
                  className="flex items-center space-x-3 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors group"
                >
                  <User
                    size={20}
                    className="group-hover:text-orange-500 transition-colors"
                  />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center space-x-3 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors group"
                >
                  <Settings
                    size={20}
                    className="group-hover:text-orange-500 transition-colors"
                  />
                  <span>Settings</span>
                </Link>

                <Link
                  href="/about"
                  className="flex items-center space-x-3 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors group"
                >
                  <Info
                    size={20}
                    className="group-hover:text-orange-500 transition-colors"
                  />
                  <span>About</span>
                </Link>
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
