import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createUser, getUser } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log(account, profile);
      console.log("Signing in:", user);

      try {
        const existingUser = await getUser(user.email);
        console.log(existingUser, "jeremy here");
        if (!existingUser) {
          console.log("Creating new user...");

          const newUser = await createUser({
            email: user.email,
            fullName: user.name,
            vanityName: user.name.split(" ").at(0),
          });

          console.log("User created:", newUser);
        } else {
          console.log("User already exists");
        }

        return true; // Allow sign-in
      } catch (error) {
        console.error("Sign-in error:", error);
        return false; // Deny sign-in on failure
      }
    },
    async jwt({ token, user }) {
      if (user) {
        const existingUser = await getUser(user.email);
        token.userId = existingUser?.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.userId) {
        session.user.userId = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authConfig);

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
