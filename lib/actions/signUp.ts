"use server";

import bcryptjs from "bcryptjs";
import { FieldValues } from "react-hook-form";

import prisma from "@/lib/prisma";
import { getUserByEmail } from "@/lib/actions/user";

export const signUp = async (values: FieldValues) => {
  const { name, email, password } = values;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  return { success: "User created successfully!" };
};
