import FormWrap from "@/components/auth/form-wrap";
import Container from "@/components/shared/container";
import CheckoutClient from "@/components/ui/checkout-client";

const CheckoutPage = () => {
  return (
    <div className="p-8">
      <Container>
        <FormWrap>
          <CheckoutClient />
        </FormWrap>
      </Container>
    </div>
  );
};

export default CheckoutPage;
