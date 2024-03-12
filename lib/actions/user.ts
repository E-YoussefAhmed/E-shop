"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/actions/session";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch {
    return null;
  }
};

// export const getUserById = async (id: string) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         id,
//       },
//     });
//     return user;
//   } catch {
//     return null;
//   }
// };

export const getUsers = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const users = await prisma.user.findMany();

    return users;
  } catch (error) {
    console.log(error);
    return null;
  }
};
