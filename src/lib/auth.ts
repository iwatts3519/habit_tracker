import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail, verifyPassword, toSafeUser } from "@/lib/queries/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const user = getUserByEmail(email.toLowerCase());
        if (!user) return null;

        const valid = await verifyPassword(user, password);
        if (!valid) return null;

        const safe = toSafeUser(user);
        return {
          id: safe.id,
          email: safe.email,
          name: safe.name,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth: session, request }) {
      const isLoggedIn = !!session?.user;
      const isLoginPage = request.nextUrl.pathname === "/login";
      const isAuthApi = request.nextUrl.pathname.startsWith("/api/auth");
      const isHealthApi = request.nextUrl.pathname === "/api/health";

      if (isAuthApi || isHealthApi) return true;
      if (isLoginPage) return true;
      if (!isLoggedIn) return false;
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
});
