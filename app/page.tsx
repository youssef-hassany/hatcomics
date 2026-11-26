"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Bangers, Barlow } from "next/font/google";
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

// Comic lettering for headlines, a sturdy condensed sans for reading text
const display = Bangers({ subsets: ["latin"], weight: "400" });
const body = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Halftone dot pattern, like printed comic ink
const halftone = (color: string, size: number) => ({
  backgroundImage: `radial-gradient(${color} 1.6px, transparent 1.7px)`,
  backgroundSize: `${size}px ${size}px`,
});

// Starburst clip-path for the "free" sticker
const burst = (() => {
  const n = 14;
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? 38 : 50;
    const a = (Math.PI * i) / n;
    pts.push(
      `${(50 + r * Math.cos(a)).toFixed(1)}% ${(50 + r * Math.sin(a)).toFixed(1)}%`,
    );
  }
  return `polygon(${pts.join(",")})`;
})();

// Shared button look: thick ink outline + hard shadow that "presses" on click
const btn =
  "inline-flex items-center justify-center gap-2 border-4 border-black px-7 py-3 text-2xl tracking-wide transition-transform motion-reduce:transition-none hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none";

const ComicLandingPage = () => {
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: <Pen className="w-6 h-6" />,
      title: "Write & Share",
      description:
        "Post about the books you love, from a long review to a quick reaction to this week's issue.",
      fill: "bg-yellow-400",
      span: "lg:col-span-2",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Rate & Review",
      description:
        "Rate what you read and help someone else pick their next one.",
      fill: "bg-white",
      span: "",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Connect",
      description:
        "Follow readers with your taste and see what they're reading.",
      fill: "bg-sky-300",
      span: "",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Discover",
      description:
        "Find new titles and keep a reading list so nothing slips past you.",
      fill: "bg-orange-500",
      span: "lg:col-span-2",
    },
  ];

  const bubbles = [
    {
      icon: <Shield className="w-8 h-8 text-green-700" />,
      title: "Moderated",
      text: "Discussions stay respectful, whatever you're a fan of.",
      tail: "left-12",
      tilt: "-rotate-1",
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Works everywhere",
      text: "Phone, tablet or desktop, it loads fast and stays out of your way.",
      tail: "left-1/2",
      tilt: "rotate-1",
    },
    {
      icon: <Globe className="w-8 h-8 text-orange-600" />,
      title: "Worldwide",
      text: "Readers from all over the world are already talking comics.",
      tail: "right-12",
      tilt: "-rotate-1",
    },
  ];

  return (
    <div
      className={`${body.className} min-h-screen bg-[#101014] text-zinc-100 overflow-x-hidden`}
    >
      {/* Hero */}
      <section
        className="px-6 py-20 lg:py-28 border-b-4 border-black"
        style={halftone("rgba(255,255,255,0.07)", 16)}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1
                className={`${display.className} text-6xl lg:text-8xl leading-[0.95] tracking-wide mb-8 -rotate-1`}
                style={{ textShadow: "4px 4px 0 #ea580c, 7px 7px 0 #000" }}
              >
                Your ultimate comic universe
              </h1>

              {/* Narration caption box */}
              <p className="relative max-w-xl bg-yellow-300 text-black border-4 border-black shadow-[6px_6px_0_0_#000] px-5 py-4 text-lg font-medium leading-snug mb-10">
                Write reviews, rate what you read, and find your next favorite
                series through people who actually read comics. Built by fans,
                for fans.
              </p>

              <SignUpButton>
                <button
                  className={`${display.className} ${btn} group bg-orange-600 text-white shadow-[6px_6px_0_0_#000]`}
                >
                  Start your journey
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform motion-reduce:transition-none" />
                </button>
              </SignUpButton>
            </div>

            {/* Cover fan */}
            <div className="relative">
              <div
                className="relative w-full h-96 flex items-center justify-center cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setIsHovered((v) => !v)}
              >
                {/* Cover 1 */}
                <div
                  className={`absolute w-40 h-60 border-[3px] border-zinc-100 bg-zinc-100 shadow-[6px_6px_0_0_#ea580c] transform transition-all duration-500 ease-out motion-reduce:transition-none ${
                    isHovered
                      ? "-translate-x-24 -rotate-12 z-10"
                      : "translate-x-2 rotate-3 z-30"
                  }`}
                >
                  <Image
                    src="/ultimate-spider-man.webp"
                    alt="Ultimate Spider-Man Comic Cover"
                    width={160}
                    height={240}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>

                {/* Cover 2 (center) */}
                <div
                  className={`absolute w-40 h-60 border-[3px] border-zinc-100 bg-zinc-100 shadow-[6px_6px_0_0_#ea580c] transform transition-all duration-500 ease-out motion-reduce:transition-none ${
                    isHovered ? "z-30" : "z-20"
                  }`}
                >
                  <Image
                    src="/batman-year-one.jpg"
                    alt="Batman Year One Comic Cover"
                    width={160}
                    height={240}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>

                {/* Cover 3 */}
                <div
                  className={`absolute w-40 h-60 border-[3px] border-zinc-100 bg-zinc-100 shadow-[6px_6px_0_0_#ea580c] transform transition-all duration-500 ease-out motion-reduce:transition-none ${
                    isHovered
                      ? "translate-x-24 rotate-12 z-10"
                      : "-translate-x-2 -rotate-3 z-10"
                  }`}
                >
                  <Image
                    src="/spawn.jpg"
                    alt="Spawn Comic Cover"
                    width={160}
                    height={240}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>

                {/* Starburst sticker */}
                <div
                  className="absolute -top-2 right-2 sm:right-10 z-40 w-28 h-28 rotate-12 pointer-events-none"
                  aria-hidden="true"
                >
                  <div
                    className="absolute inset-0 bg-black"
                    style={{ clipPath: burst }}
                  />
                  <div
                    className={`${display.className} absolute inset-[5px] bg-yellow-300 text-black flex items-center justify-center text-center text-2xl leading-[0.9]`}
                    style={{ clipPath: burst }}
                  >
                    Free
                    <br />
                    to join!
                  </div>
                </div>

                {/* Hover / tap hint */}
                <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-zinc-200 border-2 border-zinc-100 px-3 py-0.5 text-sm italic whitespace-nowrap">
                  Hover or tap the covers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features: laid out like a comic page */}
      <section
        id="features"
        className="px-6 py-20 bg-zinc-100 text-black border-b-4 border-black"
        style={halftone("rgba(0,0,0,0.09)", 12)}
      >
        <div className="max-w-6xl mx-auto">
          <h2
            className={`${display.className} text-5xl lg:text-6xl tracking-wide mb-4`}
          >
            Read it. Rate it. Talk about it.
          </h2>
          <p className="text-xl text-zinc-700 max-w-2xl mb-12 font-medium">
            From detailed reviews to following fellow fans, here&apos;s what you
            can do on HatComics.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.fill} ${feature.span} border-4 border-black shadow-[7px_7px_0_0_#000] p-6 flex flex-col justify-between min-h-[220px]`}
              >
                <div>
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3
                    className={`${display.className} text-4xl tracking-wide mb-2`}
                  >
                    {feature.title}
                  </h3>
                </div>
                <p className="text-lg font-medium leading-snug">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community: speech bubbles */}
      <section
        id="community"
        className="px-6 py-20 bg-orange-600 border-b-4 border-black"
        style={halftone("rgba(0,0,0,0.18)", 14)}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2
            className={`${display.className} text-5xl lg:text-6xl tracking-wide text-white mb-4`}
            style={{ textShadow: "4px 4px 0 #000" }}
          >
            Join the community
          </h2>
          <p className="text-xl text-white max-w-2xl mx-auto mb-14 font-medium">
            Share what you&apos;re reading, find new stories, and argue about
            who wins the fight.
          </p>

          <div className="grid md:grid-cols-3 gap-10 mb-16">
            {bubbles.map((b, i) => (
              <div
                key={i}
                className={`relative bg-white text-black border-4 border-black shadow-[6px_6px_0_0_#000] rounded-[2rem] px-6 py-7 text-left ${b.tilt}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {b.icon}
                  <h3 className={`${display.className} text-3xl tracking-wide`}>
                    {b.title}
                  </h3>
                </div>
                <p className="text-lg font-medium leading-snug">{b.text}</p>
                {/* bubble tail */}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-[14px] ${b.tail} w-6 h-6 bg-white border-r-4 border-b-4 border-black rotate-45`}
                />
              </div>
            ))}
          </div>

          <SignUpButton>
            <button
              className={`${display.className} ${btn} group bg-black text-yellow-300 shadow-[6px_6px_0_0_#fff]`}
            >
              Join the community
              <Heart className="w-6 h-6 group-hover:text-red-400 transition-colors" />
            </button>
          </SignUpButton>
        </div>
      </section>

      {/* CTA */}
      <section
        className="px-6 py-24 border-b-4 border-black"
        style={halftone("rgba(255,255,255,0.07)", 16)}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="inline-block bg-yellow-300 text-black border-4 border-black shadow-[4px_4px_0_0_#000] px-4 py-1 text-base font-semibold italic mb-8 -rotate-2">
            Meanwhile, at HatComics...
          </p>
          <h2
            className={`${display.className} text-5xl lg:text-7xl leading-[0.95] tracking-wide mb-6`}
            style={{ textShadow: "4px 4px 0 #ea580c, 6px 6px 0 #000" }}
          >
            Ready to start your comic journey?
          </h2>
          <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto">
            HatComics is where comic fans come to talk about what they&apos;re
            reading. Make an account and post your first review.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <SignUpButton>
              <button
                className={`${display.className} ${btn} bg-orange-600 text-white shadow-[6px_6px_0_0_#000]`}
              >
                Create free account
              </button>
            </SignUpButton>
            <Link
              href="/about"
              className={`${display.className} ${btn} bg-transparent text-zinc-100 !border-zinc-100 shadow-[6px_6px_0_0_#ea580c] hover:bg-zinc-900`}
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Image
              src="/hatcomics-logo.png"
              width={80}
              height={80}
              className="w-20 h-20"
              alt="HatComics"
            />
            <div className="flex space-x-6 text-zinc-400 text-lg">
              <Link
                href="/about?view=privacy"
                className="hover:text-orange-500 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/about?view=terms"
                className="hover:text-orange-500 transition-colors"
              >
                Terms
              </Link>
              <a
                href="mailto:hatcomicsorg@gmail.com"
                className="hover:text-orange-500 transition-colors"
              >
                Contact
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
