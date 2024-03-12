"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/actions/session";

export const getOrders = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const dispatchOrder = async (id: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const order = await prisma.order.update({
      where: { id },
      data: { deliveryStatus: "dispatched" },
    });

    revalidatePath("/admin/manage-orders");
    revalidatePath(`/order/${order.id}`);
    revalidatePath(`/orders`);

    return { success: "Order Dispatched", order };
  } catch (error) {
    console.log(error);
    return { error: "Oops! Something went wrong" };
  }
};

export const deliverOrder = async (id: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const order = await prisma.order.update({
      where: { id },
      data: { deliveryStatus: "delivered" },
    });

    revalidatePath("/admin/manage-orders");
    revalidatePath(`/order/${order.id}`);
    revalidatePath(`/orders`);

    return { success: "Order Delivered", order };
  } catch (error) {
    console.log(error);
    return { error: "Oops! Something went wrong" };
  }
};

export const getOrderById = async (id: string) => {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) return null;

    return order;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const getUserOrders = async (userId: string) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId,
      },
    });

    return orders;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};
