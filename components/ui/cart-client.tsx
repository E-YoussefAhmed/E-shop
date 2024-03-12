"use client";

import Link from "next/link";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";

import CartItemContent from "@/components/shared/cart-item-content";
import Heading from "@/components/shared/heading";
import Button from "@/components/shared/button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

type props = Omit<User, "createdAt" | "updatedAt" | "emailVerified"> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

const CartClient = ({ user }: { user: props | null }) => {
  const router = useRouter();
  const { cartProducts, handleClearCart, cartTotalAmount } = useCart();

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-2xl">Your cart is empty</div>
        <div>
          <Link
            href="/"
            className="text-slate-500 flex items-center gap-1 mt-2"
          >
            <MdArrowBack />
            <span>Start Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Heading title="Shopping Cart" center />
      <div className="grid grid-cols-5 text-xs ap-4 pb-2 mt-8 items-center">
        <div className="col-span-2 justify-self-start uppercase">product</div>
        <div className="justify-self-center uppercase">price</div>
        <div className="justify-self-center uppercase">quantity</div>
        <div className="justify-self-end uppercase">total</div>
      </div>
      <div>
        {cartProducts &&
          cartProducts.map((item) => (
            <CartItemContent item={item} key={item.id} />
          ))}
      </div>
      <div className="border-t[1.5px] border-slate-200 py-4 flex justify-between gap-4">
        <div className="w-[90px]">
          <Button label="Clear Cart" onCLick={handleClearCart} small outline />
        </div>
        <div className="text-sm flex flex-col gap-1 items-start">
          <div className="flex justify-between text-base w-full font-semibold">
            <span>Subtotal</span>
            <span>{formatPrice(cartTotalAmount)}</span>
          </div>
          <p className="text-slate-500">
            Taxes and shipping calculate at checkout
          </p>
          <Button
            label={user ? "Checkout" : "Login To Checkout"}
            outline={user ? false : true}
            onCLick={() => {
              user ? router.push("/checkout") : router.push("/login");
            }}
          />
          <Link
            href="/"
            className="text-slate-500 flex items-center gap-1 mt-2"
          >
            <MdArrowBack />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartClient;
