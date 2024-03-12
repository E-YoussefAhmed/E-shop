import NullData from "@/components/admin/null-data";
import { getProducts } from "@/lib/actions/product";
import Container from "@/components/shared/container";
import { getCurrentUser } from "@/lib/actions/session";
import ManageProductsClient from "@/components/admin/manage-products-client";

const ManageProductsPage = async () => {
  const data = await Promise.all([
    getProducts({ category: null }),
    getCurrentUser(),
  ]);
  const [products, user] = data;

  if (!user || user.role !== "ADMIN") {
    return <NullData title="Oops! Access Denied." />;
  }

  return (
    <div className="pt-8">
      <Container>
        <ManageProductsClient products={products!} />
      </Container>
    </div>
  );
};

export default ManageProductsPage;
