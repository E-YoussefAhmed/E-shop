import {
  PaymentElement,
  useStripe,
  useElements,
  AddressElement,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

import Heading from "@/components/shared/heading";
import Button from "@/components/shared/button";

const CheckoutForm = ({
  clientSecret,
  handleSetPaymentSuccess,
}: {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
}) => {
  const { cartTotalAmount, handleClearCart, handleSetPaymentIntent } =
    useCart();
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const formattedPrice = formatPrice(cartTotalAmount);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    // stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
    //   switch (paymentIntent?.status) {
    //     case "succeeded":
    //       setMessage("Payment succeeded!");
    //       break;
    //     case "processing":
    //       setMessage("Your payment is processing.");
    //       break;
    //     case "requires_payment_method":
    //       setMessage("Your payment was not successful, please try again.");
    //       break;
    //     default:
    //       setMessage("Something went wrong.");
    //       break;
    //   }
    // });
  }, [stripe, clientSecret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    stripe
      .confirmPayment({
        elements,
        redirect: "if_required",
      })
      .then(({ error }) => {
        if (!error) {
          toast.success("Checkout Success");

          handleClearCart();
          handleSetPaymentSuccess(true);
          handleSetPaymentIntent(null);
        }

        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <div className="mb-6">
        <Heading title="Enter your details to complete checkout" />
      </div>
      <h2 className="font-semibold mt-4 mb-2">Payment Information</h2>
      <h2 className="font-semibold mb-2">
        <AddressElement
          options={{
            mode: "billing",
            // mode: "shipping",
            // allowedCountries: ["US", "EG"],
          }}
        />
      </h2>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <div className="py-4 text-center text-slate-700 text-2xl font-bold">
        Total: {formattedPrice}
      </div>
      <Button
        label={isLoading ? "Processing..." : "Pay"}
        disabled={isLoading || !stripe || !elements}
        onCLick={() => {}}
      />
    </form>
  );
};

export default CheckoutForm;
