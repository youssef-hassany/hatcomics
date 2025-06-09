import { type Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/ui/sidebar";

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
    <ClerkProvider
      afterSignOutUrl="/"
      signInFallbackRedirectUrl="/home"
      signUpFallbackRedirectUrl="/home"
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900 text-white`}
        >
          <Sidebar />

          <main>
            {/* For signed out users - add top padding for header */}
            <SignedOut>
              <div className="pt-20">{children}</div>
            </SignedOut>

            {/* For signed in users - add left margin for sidebar */}
            <SignedIn>
              <div className="ml-0 md:ml-64 min-h-screen">
                <div className="">{children}</div>
              </div>
            </SignedIn>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
