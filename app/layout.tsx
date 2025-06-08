import { type Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HatComics - Comic Community",
  description: "The ultimate community for comic book enthusiasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900 text-white`}
        >
          <header>
            <nav className="fixed top-0 w-full bg-zinc-900/95 backdrop-blur-sm z-50 border-b border-zinc-700">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center font-bold text-zinc-900">
                      H
                    </div>
                    <span className="text-xl font-bold text-white">
                      HatComics
                    </span>
                  </div>

                  <div className="hidden md:flex space-x-8">
                    <a
                      href="#features"
                      className="text-zinc-300 hover:text-red-500 transition-colors"
                    >
                      Features
                    </a>
                    <a
                      href="#community"
                      className="text-zinc-300 hover:text-red-500 transition-colors"
                    >
                      Community
                    </a>
                    <a
                      href="#about"
                      className="text-zinc-300 hover:text-red-500 transition-colors"
                    >
                      About
                    </a>
                  </div>

                  <div className="flex space-x-3">
                    <SignedOut>
                      <button className="px-4 py-2 border border-zinc-600 text-zinc-300 rounded-lg hover:border-zinc-500 hover:text-white transition-colors">
                        <SignInButton />
                      </button>

                      <button className="px-4 py-2 bg-red-500 text-zinc-900 rounded-lg hover:bg-red-400 transition-colors font-semibold">
                        <SignUpButton />
                      </button>
                    </SignedOut>
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                  </div>
                </div>
              </div>
            </nav>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
