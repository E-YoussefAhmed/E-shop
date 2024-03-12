import {
  CartProductType,
  SelectedImgType,
} from "@/components/shared/product-details";

interface SetColorProps {
  images: SelectedImgType[];
  cardProduct: CartProductType;
  handleColorSelect: (value: SelectedImgType) => void;
}

const SetColor = ({
  images,
  cardProduct,
  handleColorSelect,
}: SetColorProps) => {
  return (
    <div>
      <div className="flex gap-4 items-center">
        <span className="uppercase font-semibold">COLOR:</span>
        <div className="flex gap-1">
          {images.map((img) => (
            <div
              key={img.color}
              onClick={() => handleColorSelect(img)}
              className={`h-7 w-7 rounded-full border-teal-300 flex items-center justify-center ${
                cardProduct.selectedImg.color === img.color
                  ? "border-[1.5px]"
                  : "border-none"
              }`}
            >
              <div
                style={{ background: img.colorCode }}
                className="h-5 w-5 rounded-full border-[1.2px] border-slate-300 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SetColor;
