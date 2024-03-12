import { redirect } from "next/navigation";

import { getOrderById } from "@/lib/actions/order";
import NullData from "@/components/admin/null-data";
import Container from "@/components/shared/container";
import OrderDetails from "@/components/shared/order-details";
import { getCurrentUser } from "@/lib/actions/session";

const OrderDetailsPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const data = await Promise.all([getOrderById(id), getCurrentUser()]);
  const [order, user] = data;

  if (!user) {
    return redirect("/login");
  }

  if (!order) return <NullData title="No Order" />;

  return (
    <div className="p-8">
      <Container>
        <OrderDetails order={order} />
      </Container>
    </div>
  );
};

export default OrderDetailsPage;
