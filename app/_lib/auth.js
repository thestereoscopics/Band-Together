import NextAuth from "next-auth";
import EmailProvider from "@auth/core/providers/email";
import Nodemailer from "next-auth/providers/nodemailer";
import GoogleProvider from "@auth/core/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { createUser, getUser } from "./data-service";

export const authConfig = {
  providers: [
    Nodemailer({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60,
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "database" },

  callbacks: {
    async signIn({ user }) {
      const existing = await getUser(user.auth_id);
      if (!existing) {
        await createUser({
          email: user.email,
          fullName: user.name || user.email.split("@")[0],
          vanityName: (user.name || "").split(" ")[0] || "",
          auth_id: user.id,
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const u = await getUser(user.email);
        token.userId = u?.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.userId) session.user.userId = token?.userId;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
