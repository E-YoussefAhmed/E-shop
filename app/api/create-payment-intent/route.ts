import Stripe from "stripe";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/actions/session";
import { CartProductType } from "@/components/shared/product-details";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const calculateOrderAmount = (items: CartProductType[]) => {
  const totalPrice = items.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;

    return acc + itemTotal;
  }, 0);

  const price = Number(totalPrice.toFixed(2));

  return price;
};

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { items, payment_intent_id } = body;
  const total = calculateOrderAmount(items) * 100;

  const orderData = {
    user: {
      connect: {
        id: currentUser.id,
      },
    },
    amount: total,
    currency: "usd",
    status: "pending",
    deliveryStatus: "pending",
    paymentIntentId: payment_intent_id,
    products: items,
  };

  if (payment_intent_id) {
    // Update the intent
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );

    if (currentUser) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        {
          amount: total,
        }
      );

      // Update the order
      const [existing_order, update_order] = await Promise.all([
        prisma.order.findFirst({
          where: { paymentIntentId: payment_intent_id },
        }),
        prisma.order.update({
          where: { paymentIntentId: payment_intent_id },
          data: {
            amount: total,
            products: items,
          },
        }),
      ]);

      if (!existing_order) {
        return NextResponse.json(
          { error: "Invalid Payment Intent" },
          { status: 400 }
        );
      }

      return NextResponse.json({ paymentIntent: updated_intent });
    }
  } else {
    // Create the intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    // create the order
    orderData.paymentIntentId = paymentIntent.id;

    await prisma.order.create({
      data: orderData,
    });

    return NextResponse.json({ paymentIntent });
  }
}
