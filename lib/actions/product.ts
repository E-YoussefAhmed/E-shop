"use server";

import axios from "axios";
import { Product, Review } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { FieldValues } from "react-hook-form";

import prisma from "@/lib/prisma";
import { deleteCloudinary, getPublicIdFromUrl } from "@/lib/utils";
import { getCurrentUser } from "@/lib/actions/session";
import { UploadedImageType } from "@/components/admin/add-product-form";

type ExtendedProduct = Product & {
  reviews: Review[];
};

export const createProduct = async (values: FieldValues) => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }
  const { name, description, brand, category, inStock, images, price } = values;

  // console.log(values);

  // save product to mongodb
  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        brand,
        category,
        inStock,
        images,
        price: parseFloat(price),
      },
    });

    revalidatePath("/admin/manage-products");

    return { product, success: "Product added successfully" };
  } catch {
    return { error: "Something went wrong" };
  }
};

export const getProducts = async ({
  category,
  searchTerm,
}: {
  category?: string | null;
  searchTerm?: string | null;
}) => {
  try {
    let searchString = searchTerm;
    if (!searchString) {
      searchString = "";
    }

    let query: any = {};

    if (category) {
      query.category = category;
    }

    const products = await prisma.product.findMany({
      where: {
        ...query,
        OR: [
          {
            name: {
              contains: searchString,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchString,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            createdDate: "desc",
          },
        },
      },
    });

    return products;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const updateProduct = async (id: string, inStock: boolean) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const product = await prisma.product.update({
      where: { id },
      data: { inStock },
    });

    revalidatePath("/admin/manage-products");

    return { success: "Product status changed", product };
  } catch (error) {
    console.log(error);
    return { error: "Oops! Something went wrong" };
  }
};

export const deleteProduct = async (
  id: string,
  images: UploadedImageType[]
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    // Delete image from cloudinary
    for (let image of images) {
      const publicId = getPublicIdFromUrl(image.image);
      console.log({ publicId });

      if (publicId) {
        await deleteCloudinary(publicId);
      }
    }

    const product = await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/manage-products");

    return { success: "Product deleted", product };
  } catch (error) {
    console.log(error);
    return { error: "Oops! Something went wrong" };
  }
};

export const getProductById = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            createdDate: "desc",
          },
        },
      },
    });

    if (!product) return null;

    return product;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const addProductRating = async (
  product: ExtendedProduct,
  comment: string,
  rating: number
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { error: "Unauthenticated" };
    }

    const deliveredOrder = await prisma.order.findFirst({
      where: {
        userId: currentUser.id,
        deliveryStatus: "delivered",
        products: {
          some: {
            id: product.id,
          },
        },
      },
    });

    if (!deliveredOrder) {
      return { error: "User can't review items didn't buy" };
    }

    const userReview = product.reviews.find(
      (review) => review.userId === currentUser.id
    );

    if (userReview) {
      return { error: "User already has a review" };
    }

    const review = await prisma.review.create({
      data: {
        comment,
        rating,
        productId: product.id,
        userId: currentUser.id,
      },
    });

    revalidatePath(`/product/${product.id}`);

    return { review };
  } catch (error: any) {
    console.log(error);
    return null;
  }
};
