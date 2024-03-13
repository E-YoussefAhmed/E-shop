"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Rating } from "@mui/material";

import { formatPrice, truncateText } from "@/lib/utils";

const ProductCard = ({ data }: { data: any }) => {
  const productRating = useMemo(
    () =>
      data.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
      data.reviews.length,
    [data.reviews]
  );

  return (
    <div
      className="col-span-1 cursor-pointer border-[1.2px] border-slate-200 bg-slate-50 
    rounded-sm p-2 transition hover:scale-105 text-center text-sm h-full"
    >
      <div className="flex flex-col items-center w-full gap-1">
        <div className="aspect-square overflow-hidden w-full relative">
          <Image
            fill
            className="w-full h-full object-contain"
            src={data.images[0].image}
            alt={data.name}
          />
        </div>
        <div className="mt-4 break-words w-full">{truncateText(data.name)}</div>
        <div>
          <Rating value={productRating} precision={0.5} readOnly />
        </div>
        <div>{data.reviews.length}</div>
        <div className="font-semibold">{formatPrice(data.price)}</div>
      </div>
    </div>
  );
};

export default ProductCard;
