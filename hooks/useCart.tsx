import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";

import { CartProductType } from "@/components/shared/product-details";

type CartContextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleCartQtyIncrease: (product: CartProductType) => void;
  handleCartQtyDecrease: (product: CartProductType) => void;
  handleClearCart: () => void;
  paymentIntent: string | null;
  handleSetPaymentIntent: (val: string | null) => void;
};

interface Props {
  [propName: string]: any;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartContextProvider = (props: Props) => {
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
    null
  );

  useEffect(() => {
    const cartItems: any = localStorage.getItem("cartItems");
    const cartProducts: CartProductType[] | null = JSON.parse(cartItems);
    const eShopPaymentIntent: any = localStorage.getItem("paymentIntent");
    const paymentIntent: string | null = JSON.parse(eShopPaymentIntent);

    if (cartProducts) {
      setCartProducts(cartProducts);
    }
    if (paymentIntent) {
      setPaymentIntent(paymentIntent);
    }
  }, []);

  useEffect(() => {
    const getTotals = () => {
      if (cartProducts) {
        const { total, qty } = cartProducts?.reduce(
          (acc, item) => {
            const itemTotal = item.quantity * item.price;

            acc.total += itemTotal;
            acc.qty += item.quantity;

            return acc;
          },
          {
            total: 0,
            qty: 0,
          }
        );

        setCartTotalQty(qty);
        setCartTotalAmount(total);
      }
    };

    getTotals();
  }, [cartProducts]);

  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      let updatedCart;
      if (prev) {
        updatedCart = [...prev, product];
      } else {
        updatedCart = [product];
      }

      toast.success("Product added to cart!");
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);

  const handleRemoveProductFromCart = useCallback(
    (product: CartProductType) => {
      if (cartProducts) {
        const filteredProducts = cartProducts.filter(
          (item) => item.id !== product.id
        );

        setCartProducts(filteredProducts);
        toast.success("Product removed from cart!");
        localStorage.setItem("cartItems", JSON.stringify(filteredProducts));
      }
    },
    [cartProducts]
  );

  const handleCartQtyIncrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;

      if (product.quantity === 99) return toast.error("Oops! Maximum reached");

      if (cartProducts) {
        updatedCart = [...cartProducts];

        const existingIndex = cartProducts?.findIndex(
          (item) => item.id === product.id
        );

        if (existingIndex > -1) {
          updatedCart[existingIndex].quantity += 1;
        }

        setCartProducts(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      }
    },
    [cartProducts]
  );

  const handleCartQtyDecrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;

      if (product.quantity === 1) return toast.error("Oops! Minimum reached");

      if (cartProducts) {
        updatedCart = [...cartProducts];

        const existingIndex = cartProducts?.findIndex(
          (item) => item.id === product.id
        );

        if (existingIndex > -1) {
          updatedCart[existingIndex].quantity -= 1;
        }

        setCartProducts(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      }
    },
    [cartProducts]
  );

  const handleClearCart = useCallback(() => {
    setCartProducts(null);
    setCartTotalQty(0);
    localStorage.removeItem("cartItems");
  }, []);

  const handleSetPaymentIntent = useCallback((val: string | null) => {
    setPaymentIntent(val);
    localStorage.setItem("paymentIntent", JSON.stringify(val));
  }, []);

  const value = {
    cartTotalQty,
    cartTotalAmount,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    handleClearCart,
    paymentIntent,
    handleSetPaymentIntent,
  };

  return <CartContext.Provider value={value} {...props} />;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useCart must be used within a CartContextProvider");
  }

  return context;
};
