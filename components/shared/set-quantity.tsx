import { CartProductType } from "@/components/shared/product-details";

interface SetQtyProps {
  cartCounter?: boolean;
  cartProduct: CartProductType;
  handleQtyIncrease: () => void;
  handleQtyDecrease: () => void;
}

const SetQuantity = ({
  cartProduct,
  cartCounter,
  handleQtyDecrease,
  handleQtyIncrease,
}: SetQtyProps) => {
  return (
    <div className="flex gap-8 items-center">
      {cartCounter ? null : (
        <div className="font-semibold uppercase">QUANTITY:</div>
      )}
      <div className="flex gap-4 items-center text-base">
        <button
          className="border-[1.2px] border-slate-300 px-2 rounded"
          onClick={handleQtyDecrease}
        >
          -
        </button>
        <div>{cartProduct.quantity}</div>
        <button
          className="border-[1.2px] border-slate-300 px-2 rounded"
          onClick={handleQtyIncrease}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default SetQuantity;
