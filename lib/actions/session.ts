"use server";

import { getServerSession } from "next-auth";
import { unstable_noStore as noStore } from "next/cache";

import prisma from "@/lib/prisma";
import { authOptions } from "@/auth";
import { getUserByEmail } from "@/lib/actions/user";

export const getSession = async () => {
  noStore();

  return await getServerSession(authOptions);
};

export const getCurrentUser = async () => {
  noStore();

  try {
    const session = await getSession();

    if (!session?.user?.email) return null;

    const currentUser = await getUserByEmail(session.user.email);

    if (!currentUser) return null;

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toString() || null,
    };
  } catch (error: any) {
    return null;
  }
};
