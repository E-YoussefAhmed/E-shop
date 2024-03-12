"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useState, useCallback } from "react";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";

import { useCart } from "@/hooks/useCart";
import CheckoutForm from "@/components/ui/checkout-form";
import Button from "@/components/shared/button";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutClient = () => {
  const router = useRouter();
  const { cartProducts, paymentIntent, handleSetPaymentIntent } = useCart();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // console.log("paymentIntent", paymentIntent);
  // console.log("clientSecret", clientSecret);

  useEffect(() => {
    // create a paymentIntent as the page loads
    if (cartProducts) {
      setLoading(true);
      setError(false);

      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartProducts,
          payment_intent_id: paymentIntent,
        }),
      })
        .then((res) => {
          setLoading(false);
          if (res.status === 401) {
            return router.push("/login");
          }

          return res.json();
        })
        .then((data) => {
          setClientSecret(data.paymentIntent.client_secret);
          handleSetPaymentIntent(data.paymentIntent.id);
        })
        .catch((error) => {
          console.log(error);
          setError(true);
          toast.error("Something went wrong");
        })
        .finally(() => setLoading(false));
    }
  }, [cartProducts, paymentIntent, handleSetPaymentIntent, router]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

  const handleSetPaymentSuccess = useCallback((value: boolean) => {
    setPaymentSuccess(value);
  }, []);

  return (
    <div className="w-full">
      {clientSecret && cartProducts && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            handleSetPaymentSuccess={handleSetPaymentSuccess}
          />
        </Elements>
      )}
      {loading && <div className="text-center">Loading Checkout...</div>}
      {error && (
        <div className="text-center text-rose-500">Something went wrong...</div>
      )}
      {paymentSuccess && (
        <div className="flex items-center flex-col gap-4">
          <div className="text-teal-500 text-center text-4xl">
            Payment Success
          </div>
          <div className="max-w-[220px] w-full">
            <Button
              label="View Your Orders"
              onCLick={() => router.push("/orders")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutClient;
