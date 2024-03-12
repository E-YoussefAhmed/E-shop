import Link from "next/link";
import { Product } from "@prisma/client";

import { getProducts } from "@/lib/actions/product";
import NullData from "@/components/admin/null-data";
import HomeBanner from "@/components/ui/home-banner";
import Container from "@/components/shared/container";
import ProductCard from "@/components/shared/product-card";

export default async function Home({
  searchParams: { category, searchTerm },
}: {
  searchParams: {
    category?: string | null;
    searchTerm?: string | null;
  };
}) {
  const products = await getProducts({ category, searchTerm });

  if (products?.length === 0 || !products) {
    return <NullData title="Oops! No products found" />;
  }

  return (
    <div className="p-8">
      <Container>
        <div>
          <HomeBanner />
        </div>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
        2xl:grid-cols-6 gap-8"
        >
          {products.map((product: Product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <ProductCard data={product} key={product.id} />
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
