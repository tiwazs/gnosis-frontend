import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";
import { ensureGatewayJwt } from "../../../lib/gatewayJwt";

function mainApiUrl(): string {
  return (process.env.MAIN_API_URL || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      issuer: "https://github.com/login/oauth",
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const response = await fetch(`${mainApiUrl()}/api/access/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });
        if (!response.ok) {
          return null;
        }
        const data = await response.json();
        if (!data?.id || !data?.token) {
          return null;
        }
        return {
          id: data.id,
          email: data.email,
          name: data.name,
          accessToken: data.token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.email = user.email;
        const fromLogin = (user as { accessToken?: string }).accessToken;
        if (fromLogin) {
          token.accessToken = fromLogin;
        }
      }
      const userId = token.uid || token.sub;
      if (userId) {
        const minted = ensureGatewayJwt(
          String(userId),
          String(token.email || ""),
          token.accessToken,
        );
        if (minted) {
          token.accessToken = minted;
        }
      }
      return token;
    },
    async session({ session, token }) {
      const userId = String(token.uid || token.sub || "");
      session.userId = userId;
      session.userEmail = token.email;
      session.accessToken = ensureGatewayJwt(userId, String(token.email || ""), token.accessToken);
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextAuth(req, res, authOptions);
}
