import { NextResponse } from "next/server";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth: session, request }) {
      const isLoggedIn = !!session?.user;
      const { pathname } = request.nextUrl;
      const isLoginPage = pathname === "/login";
      const isAuthApi = pathname.startsWith("/api/auth");
      const isHealthApi = pathname === "/api/health";
      const isApiRoute = pathname.startsWith("/api/");

      if (isAuthApi || isHealthApi) return true;
      if (isLoginPage) return true;

      if (!isLoggedIn) {
        if (isApiRoute) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return false;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
