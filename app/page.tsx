"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  Users,
  BookOpen,
  Pen,
  Heart,
  ArrowRight,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

const ComicLandingPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Pen className="w-6 h-6" />,
      title: "Write & Share",
      description:
        "Create engaging Posts about your favorite comics and share your thoughts with the community",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Rate & Review",
      description:
        "Review comics, rate them, and help others discover their next great read",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Connect",
      description:
        "Follow fellow comic enthusiasts and build your network of like-minded readers",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Discover",
      description:
        "Explore new titles, track your reading list, and never miss a great comic again",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              className={`transform transition-all duration-1000 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-zinc-100">
                Your Ultimate
                <span className="block text-orange-600">Comic Universe</span>
              </h1>
              <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
                Join the most vibrant community of comic book enthusiasts. Write
                reviews, share your passion, and discover your next favorite
                series in a platform built by fans, for fans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-700 transition-all transform hover:scale-105 flex items-center justify-center">
                  <SignUpButton>Start Your Journey</SignUpButton>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                {/* <button className="border-2 border-zinc-600 text-zinc-300 px-8 py-3 rounded-lg text-lg font-medium hover:bg-zinc-800 transition-all">
                  Explore Comics
                </button> */}
              </div>
            </div>

            {/* Interactive Comic Covers */}
            <div
              className={`relative transform transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
            >
              <div
                className="relative w-full h-96 flex items-center justify-center cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Comic Cover 1 */}
                <div
                  className={`absolute w-40 h-60 rounded-lg shadow-xl transform transition-all duration-700 ease-out ${
                    isHovered
                      ? "-translate-x-20 -rotate-12 z-10"
                      : "translate-x-2 rotate-3 z-30"
                  }`}
                >
                  <Image
                    src="/ultimate-spider-man.webp"
                    alt="Ultimate Spider-Man Comic Cover"
                    width={160}
                    height={240}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    priority
                  />
                </div>

                {/* Comic Cover 2 (Center) */}
                <div
                  className={`absolute w-40 h-60 rounded-lg shadow-xl transform transition-all duration-700 ease-out ${
                    isHovered
                      ? "translate-y-0 rotate-0 z-30"
                      : "translate-x-0 rotate-0 z-20"
                  }`}
                >
                  <Image
                    src="/batman-year-one.jpg"
                    alt="Batman Year One Comic Cover"
                    width={160}
                    height={240}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    priority
                  />
                </div>

                {/* Comic Cover 3 */}
                <div
                  className={`absolute w-40 h-60 rounded-lg shadow-xl transform transition-all duration-700 ease-out ${
                    isHovered
                      ? "translate-x-20 rotate-12 z-10"
                      : "-translate-x-2 -rotate-3 z-10"
                  }`}
                >
                  <Image
                    src="/spawn.jpg"
                    alt="Spawn Comic Cover"
                    width={160}
                    height={240}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    priority
                  />
                </div>

                {/* Hover instruction */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <p className="text-sm text-zinc-500 animate-pulse">
                    Hover to explore
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-zinc-100">
              Everything You Need to
              <span className="block text-orange-600">Explore Comics</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              From writing detailed reviews to connecting with fellow fans, our
              platform provides all the tools you need to dive deep into the
              comic book universe.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-orange-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-zinc-100">
                  {feature.title}
                </h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="px-6 py-20 bg-zinc-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-zinc-100">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-zinc-400 mb-12 max-w-3xl mx-auto">
            Connect with comic book enthusiasts from around the world. Share
            your passion, discover new stories, and be part of something
            amazing.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 rounded-xl bg-zinc-800 border border-zinc-700">
              <Shield className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2 text-zinc-100">
                Safe Community
              </h3>
              <p className="text-zinc-400">
                Moderated discussions and respectful environment for all fans
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-800 border border-zinc-700">
              <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
              <h3 className="text-xl font-semibold mb-2 text-zinc-100">
                Fast & Responsive
              </h3>
              <p className="text-zinc-400">
                Lightning-fast platform that works seamlessly on all devices
              </p>
            </div>
            <div className="p-6 rounded-xl bg-zinc-800 border border-zinc-700">
              <Globe className="w-12 h-12 mx-auto mb-4 text-orange-600" />
              <h3 className="text-xl font-semibold mb-2 text-zinc-100">
                Global Reach
              </h3>
              <p className="text-zinc-400">
                Connect with comic fans from every corner of the world
              </p>
            </div>
          </div>

          <button className="group bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-700 transition-all transform hover:scale-105 flex items-center justify-center mx-auto">
            <SignUpButton>Join the Community</SignUpButton>
            <Heart className="ml-2 w-5 h-5 group-hover:text-red-300 transition-colors" />
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-zinc-100">
            Ready to Start Your
            <span className="block text-orange-600">Comic Journey?</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Join thousands of comic enthusiasts who have already made HatComics
            their home for all things comics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-700 transition-all transform hover:scale-105">
              <SignUpButton>Create Free Account</SignUpButton>
            </button>
            <Link
              href="/about"
              className="border-2 border-zinc-600 text-zinc-300 px-8 py-3 rounded-lg text-lg font-medium hover:bg-zinc-800 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-zinc-800 border-t border-zinc-700">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image
                src="/hatcomics-logo.png"
                width={80}
                height={80}
                className="w-20 h-20"
                alt="HatComics"
              />
            </div>
            <div className="flex space-x-6 text-zinc-400">
              <a href="#" className="hover:text-zinc-100 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-zinc-100 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-zinc-100 transition-colors">
                Contact
              </a>
              <a href="#" className="hover:text-zinc-100 transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="text-center text-zinc-500 mt-8">
            © 2025 HatComics.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ComicLandingPage;
