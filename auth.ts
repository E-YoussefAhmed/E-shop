import { NextAuthOptions } from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import Google from "@auth/core/providers/google"
// import Credentials from "@auth/core/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password)
          throw new Error("Invalid email or password");

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.hashedPassword)
          throw new Error("Invalid email or password");

        const isCorrectPassword = await compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) throw new Error("Invalid email or password");

        return user;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthOptions;
