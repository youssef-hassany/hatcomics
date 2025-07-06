import { type Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/ui/sidebar";
import Providers from "@/components/common/Providers";

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
  icons: [
    { rel: "icon", url: "/hatcomics.png" },
    { rel: "shortcut icon", url: "/hatcomics.png" },
    { rel: "apple-touch-icon", url: "/hatcomics.png" },
  ],
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
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900 text-white relative`}
        >
          <Providers>
            <Sidebar />

            <main>
              <SignedOut>
                <div className="pt-20">{children}</div>
              </SignedOut>

              <SignedIn>
                <div className="ml-0 md:ml-64 min-h-screen">
                  <div>{children}</div>
                </div>
              </SignedIn>
            </main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
