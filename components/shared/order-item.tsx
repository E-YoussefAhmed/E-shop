import Image from "next/image";
import { CartProductType } from "@prisma/client";

import { formatPrice, truncateText } from "@/lib/utils";

const OrderItem = ({ item }: { item: CartProductType }) => {
  return (
    <div
      className="grid grid-cols-5 text-xs md:text-sm gap-4 border-t-[1.5px]
  border-slate-200 py-4 items-center"
    >
      <div className="col-span-2 justify-self-start flex gap-2 md:gap-4">
        <div className="relative w-[70px] aspect-square">
          <Image
            src={item.selectedImg.image}
            alt={item.name}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div>{truncateText(item.name)}</div>
          <div>{item.selectedImg.color}</div>
        </div>
      </div>
      <div className="justify-self-center">{formatPrice(item.price)}</div>
      <div className="justify-self-center">{item.quantity}</div>
      <div className="justify-self-end font-semibold">
        ${(item.quantity * item.price).toFixed(2)}
      </div>
    </div>
  );
};

export default OrderItem;
