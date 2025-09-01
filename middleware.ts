export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/generate/:path*",
    "/projects/:path*",
    "/renders/:path*",
    "/assets/:path*",
  ],
};

