import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export type SessionRole = "admin" | "team";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const admin = await prisma.adminUser.findUnique({
          where: { email: credentials.email },
        });
        if (admin && (await bcrypt.compare(credentials.password, admin.password))) {
          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: "admin" as SessionRole,
          };
        }

        const team = await prisma.teamUser.findUnique({
          where: { email: credentials.email },
        });
        if (team && (await bcrypt.compare(credentials.password, team.password))) {
          return {
            id: team.id,
            email: team.email,
            name: team.name,
            role: "team" as SessionRole,
            npc: team.npc,
            mustResetPassword: team.mustResetPassword,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as typeof user & {
          role: SessionRole;
          npc?: string;
          mustResetPassword?: boolean;
        };
        token.id = u.id;
        token.role = u.role;
        token.npc = u.npc;
        token.mustResetPassword = u.mustResetPassword;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (
          session.user as {
            id?: string;
            role?: SessionRole;
            npc?: string;
            mustResetPassword?: boolean;
          }
        ).id = token.id as string;
        (session.user as { role?: SessionRole }).role = token.role as SessionRole;
        (session.user as { npc?: string }).npc = token.npc as string | undefined;
        (session.user as { mustResetPassword?: boolean }).mustResetPassword =
          token.mustResetPassword as boolean | undefined;
      }
      return session;
    },
  },
};
