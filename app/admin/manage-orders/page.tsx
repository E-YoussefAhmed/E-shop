import { Order, User } from "@prisma/client";

import NullData from "@/components/admin/null-data";
import { getOrders } from "@/lib/actions/order";
import Container from "@/components/shared/container";
import { getCurrentUser } from "@/lib/actions/session";
import ManageOrdersClient from "@/components/admin/manage-orders-client";

type ExtendedOrder = Order & {
  user: User;
};

const ManageOrdersPage = async () => {
  const data = await Promise.all([getOrders(), getCurrentUser()]);
  const [orders, user] = data;

  if (!user || user.role !== "ADMIN") {
    return <NullData title="Oops! Access Denied." />;
  }

  return (
    <div className="pt-8">
      <Container>
        <ManageOrdersClient orders={orders as ExtendedOrder[]} />
      </Container>
    </div>
  );
};

export default ManageOrdersPage;
