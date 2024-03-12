import AddRating from "@/components/ui/add-rating";
import NullData from "@/components/admin/null-data";
import Container from "@/components/shared/container";
import { getProductById } from "@/lib/actions/product";
import ListRating from "@/components/shared/list-rating";
import ProductDetails from "@/components/shared/product-details";

const ProductDetailsPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const product = await getProductById(id);

  if (!product) {
    return <NullData title="Oops! Product does not exist" />;
  }

  return (
    <div className="p-8">
      <Container>
        <ProductDetails product={product} />
        <div className="flex flex-col mt-20 gap-4">
          <AddRating product={product} />
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailsPage;
