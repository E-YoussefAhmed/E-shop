"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { MdCheckCircle } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Rating } from "@mui/material";
import { Product, Review } from "@prisma/client";

import ProductImage from "@/components/shared/product-image";
import SetQuantity from "@/components/shared/set-quantity";
import SetColor from "@/components/shared/set-color";
import Button from "@/components/shared/button";
import { useCart } from "@/hooks/useCart";

export type CartProductType = {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  selectedImg: SelectedImgType;
  quantity: number;
  price: number;
};

export type SelectedImgType = {
  color: string;
  colorCode: string;
  image: string;
};

export type ExtendedProduct = Product & {
  reviews: Review[];
};

const ProductDetails = ({ product }: { product: ExtendedProduct }) => {
  const router = useRouter();
  const { handleAddProductToCart, cartProducts } = useCart();
  const [isProductInCart, setIsProductInCart] = useState(false);
  const [cartProduct, setCartProduct] = useState<CartProductType>({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand,
    selectedImg: product.images[0],
    quantity: 1,
    price: product.price,
  });

  const productRating = useMemo(
    () =>
      product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
      product.reviews.length,
    [product.reviews]
  );

  useEffect(() => {
    setIsProductInCart(false);

    if (cartProducts) {
      const existingIndex = cartProducts.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex > -1) {
        setIsProductInCart(true);
      }
    }
  }, [cartProducts, product.id]);

  const handleColorSelect = useCallback((image: SelectedImgType) => {
    setCartProduct((prev) => {
      return {
        ...prev,
        selectedImg: image,
      };
    });
  }, []);

  const handleQtyIncrease = useCallback(() => {
    setCartProduct((prev) => {
      return {
        ...prev,
        quantity: prev.quantity + 1,
      };
    });
  }, []);

  const handleQtyDecrease = useCallback(() => {
    if (cartProduct.quantity === 1) return;

    setCartProduct((prev) => {
      return {
        ...prev,
        quantity: prev.quantity - 1,
      };
    });
  }, [cartProduct]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <ProductImage
        cartProduct={cartProduct}
        product={product}
        handleColorSelect={handleColorSelect}
      />
      <div className="flex flex-col gap-1 text-slate-500 text-sm">
        <h2 className="text-3xl font-medium text-slate-700">{product.name}</h2>
        <div className="flex items-center gap-2">
          <Rating value={productRating} precision={0.5} readOnly />
          <div>{product.reviews.length} reviews</div>
        </div>
        <Horizontal />
        <div className="text-justify">{product.description}</div>
        <Horizontal />
        <div>
          <span className="uppercase font-semibold">category:</span>{" "}
          {product.category}
        </div>
        <div>
          <span className="uppercase font-semibold">brand:</span>{" "}
          {product.brand}
        </div>
        <div
          className={`${product.inStock ? "text-teal-400" : "text-rose-400"}`}
        >
          {product.inStock ? "In stock" : "Out of stock"}
        </div>
        <Horizontal />
        {isProductInCart ? (
          <>
            <p className="mb-2 text-slate-500 flex items-center gap-1">
              <MdCheckCircle size={20} className="text-teal-400" />
              <span>Product added to cart</span>
            </p>
            <div className="max-w-[300px]">
              <Button
                label="View Cart"
                outline
                onCLick={() => router.push("/cart")}
              />
            </div>
          </>
        ) : (
          <>
            <SetColor
              cardProduct={cartProduct}
              images={product.images}
              handleColorSelect={handleColorSelect}
            />
            <Horizontal />
            <SetQuantity
              cartProduct={cartProduct}
              handleQtyIncrease={handleQtyIncrease}
              handleQtyDecrease={handleQtyDecrease}
            />
            <Horizontal />
            <div>
              <Button
                custom="max-w-[300px]"
                label="Add To Cart"
                disabled={!product.inStock}
                onCLick={() => handleAddProductToCart(cartProduct)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

function Horizontal() {
  return <hr className="w-[30%] my-2" />;
}
