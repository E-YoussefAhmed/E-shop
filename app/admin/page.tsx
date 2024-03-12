import { Order, User } from "@prisma/client";

import { getUsers } from "@/lib/actions/user";
import { getOrders } from "@/lib/actions/order";
import Summary from "@/components/admin/summary";
import { getGraphData } from "@/lib/actions/data";
import BarGraph from "@/components/admin/bar-graph";
import { getProducts } from "@/lib/actions/product";
import Container from "@/components/shared/container";

const AdminPage = async () => {
  const data = await Promise.all([
    getProducts({ category: null }),
    getOrders(),
    getUsers(),
    getGraphData(),
  ]);

  const [products, orders, users, graphData] = data;

  return (
    <div className="pt-8">
      <Container>
        <Summary
          products={products!}
          orders={orders as Order[]}
          users={users as User[]}
        />
        <div className="mt-4 mx-auto max-w-[1150px]">
          <BarGraph data={graphData} />
        </div>
      </Container>
    </div>
  );
};

export default AdminPage;
