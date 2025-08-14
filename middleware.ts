import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // Define your protected routes
  const protectedRoutes = [
    "/stats",
    "/profile",
    "/settings",
    "/home",
    "/comics", // This will protect /comics but not /comics/[id]
    "/posts", // This will protect /posts but not /posts/[id]
    "/reviews",
  ];

  // Define public routes that should be accessible without authentication
  const publicRoutes = ["/", "/sign-in", "/sign-up", "/about"];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  // Check if it's a specific post or comic (public)
  const isSpecificPost = /^\/posts\/[^\/]+$/.test(pathname);
  const isSpecificComic = /^\/comics\/[^\/]+$/.test(pathname);
  const isSpecificReview = /^\/reviews\/[^\/]+$/.test(pathname);

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => {
    if (route === "/posts" || route === "/comics") {
      // Only protect the exact route, not sub-routes
      return pathname === route;
    }
    return pathname.startsWith(route);
  });

  // If user is not logged in and trying to access a protected route
  // BUT allow specific posts and comics even without login
  if (
    !userId &&
    isProtectedRoute &&
    !isSpecificPost &&
    !isSpecificComic &&
    !isSpecificReview
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user is logged in and on root page, redirect to /home
  if (userId && pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Optional: If user is logged in and trying to access sign-in/sign-up pages
  if (userId && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
