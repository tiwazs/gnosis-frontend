import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";

function mainApiUrl(): string {
  return (process.env.MAIN_API_URL || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
}

async function issueApiToken(userId: string): Promise<string | undefined> {
  const secret = process.env.GATEWAY_INTERNAL_SECRET;
  const base = mainApiUrl();
  if (!secret || !base) {
    return undefined;
  }
  const response = await fetch(`${base}/internal/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Gateway-Secret": secret,
    },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) {
    return undefined;
  }
  const data = await response.json();
  return typeof data.token === "string" ? data.token : undefined;
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
    async jwt({ token, user, account }) {
      if (user) {
        token.uid = user.id;
        token.email = user.email;
        const fromCredentials = (user as { accessToken?: string }).accessToken;
        if (fromCredentials) {
          token.accessToken = fromCredentials;
        } else if (account?.provider === "github") {
          token.accessToken = await issueApiToken(String(user.id));
        }
      }
      if (!token.accessToken && token.uid) {
        token.accessToken = await issueApiToken(String(token.uid));
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.accessToken = token.accessToken;
        session.userId = token.uid;
        session.userEmail = token.email;
      }
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

export default NextAuth(authOptions)
