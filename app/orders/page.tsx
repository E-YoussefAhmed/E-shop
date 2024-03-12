import { redirect } from "next/navigation";

import NullData from "@/components/admin/null-data";
import { getUserOrders } from "@/lib/actions/order";
import Container from "@/components/shared/container";
import { getCurrentUser } from "@/lib/actions/session";
import OrdersClient from "@/components/shared/orders-client";

const OrdersPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/login");
  }
  const orders = await getUserOrders(user.id);
  // const data = await Promise.all([getOrders(), getCurrentUser()]);
  // const [orders, user] = data;

  if (!user || user.role !== "ADMIN") {
    return <NullData title="Oops! Access Denied." />;
  }

  if (!orders) {
    return <NullData title="No orders yet!" />;
  }

  return (
    <div className="pt-8">
      <Container>
        <OrdersClient orders={orders} />
      </Container>
    </div>
  );
};

export default OrdersPage;
