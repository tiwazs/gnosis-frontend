import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import prisma from "../../../lib/prisma";

export const authOptions:NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      // GitHub now sends RFC 9207 `iss` on the callback. Without this, openid-client
      // throws "issuer must be configured on the issuer".
      issuer: "https://github.com/login/oauth",
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.email = user.email;
        token.apikey = user.apiKey;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.apikey = token.apikey;
        session.userId = token.uid;
        session.userEmail = token.email;
        console.log('data: ' + JSON.stringify(session.apikey));
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
  },
  jwt: {
    maxAge: 60 * 60, // 1 hour
  },
}

export default NextAuth(authOptions)