import { type Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/ui/sidebar";
import Providers from "@/components/common/Providers";
import Adsense from "@/components/common/Adsense";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HatComics - هات كوميكس | Ultimate Comic Book Community Platform",
  description:
    "انضم إلى هات كوميكس (HatComics)، أفضل منصة كوميكس عربية لمحبي القصص المصورة. اكتب المراجعات، شارك المنشورات، واكتشف كوميكس رائعة جديدة. عالم الكوميكس المثالي ينتظرك!",
  keywords:
    "هات كوميكس, كوميكس, كوميكس عربي, قصص مصورة, مراجعات كوميكس, مجتمع كوميكس, HatComics, Hat Comics, comic book platform, comic reviews, comic community, Arabic comics, كتب مصورة, قصص مصورة عربية",
  alternates: {
    canonical: "https://hat-comics.com",
  },
  icons: [
    { rel: "icon", url: "/hatcomics.png" },
    { rel: "shortcut icon", url: "/hatcomics.png" },
    { rel: "apple-touch-icon", url: "/hatcomics.png" },
  ],
  openGraph: {
    title: "HatComics - هات كوميكس | Ultimate Comic Book Community",
    description:
      "انضم إلى هات كوميكس (HatComics)، أفضل منصة كوميكس عربية لمحبي القصص المصورة. اكتب المراجعات، شارك المنشورات، واكتشف كوميكس رائعة جديدة. عالم الكوميكس المثالي ينتظرك!",
    url: "https://hat-comics.com",
    siteName: "HatComics",
    locale: "ar_EG",
    alternateLocale: "en_US",
    type: "website",
    images: [
      {
        url: `/hatcomics.png`,
        width: 1024,
        height: 1024,
        alt: "HatComics - هات كوميكس",
      },
    ],
  },
};

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HatComics - هات كوميكس",
  alternateName: ["Hat Comics", "هات كوميكس", "كوميكس"],
  url: "https://hat-comics.com",
  description: "أفضل منصة كوميكس عربية لمحبي القصص المصورة",
  inLanguage: ["ar", "en"],
  potentialAction: {
    "@type": "SearchAction",
    target: "https://hat-comics.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
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
        <head>
          <meta
            name="google-adsense-account"
            content="ca-pub-8123628805164111"
          ></meta>
          <Adsense />
        </head>
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
