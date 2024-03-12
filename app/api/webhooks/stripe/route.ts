import Stripe from "stripe";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

async function handler(req: NextRequest) {
  const buf = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  if (!sig) {
    return NextResponse.json(
      { error: "Missing the stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook error:" + error },
      { status: 400 }
    );
  }

  // console.log("✅ Success:", { event });

  switch (event.type) {
    case "charge.succeeded":
      const charge = event.data.object as Stripe.Charge;

      // console.log({ charge });

      if (typeof charge.payment_intent === "string") {
        const order = await prisma.order.update({
          where: {
            paymentIntentId: charge.payment_intent,
          },
          data: {
            status: "completed",
            //@ts-ignore
            address: charge.billing_details.address,
          },
        });

        revalidatePath("/admin/manage-orders");
        revalidatePath(`/order/${order.id}`);
        revalidatePath("/orders");
      }
      break;
    default:
      console.log("unhandled event type:" + event.type);
  }
  return NextResponse.json({ received: true });
}

export { handler as POST };
