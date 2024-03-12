import Container from "@/components/shared/container";
import CartClient from "@/components/ui/cart-client";
import { getCurrentUser } from "@/lib/actions/session";

const CartPage = async () => {
  const user = await getCurrentUser();

  return (
    <div className="pt-8">
      <Container>
        <CartClient user={user} />
      </Container>
    </div>
  );
};

export default CartPage;
