"use client";

import { useCallback, useEffect, useState } from "react";

import { ImageType } from "@/components/admin/add-product-form";
import SelectImage from "@/components/shared/select-image";
import Button from "@/components/shared/button";

interface SelectColorProps {
  item: ImageType;
  addImageToState: (value: ImageType) => void;
  removeImageFromState: (value: ImageType) => void;
  isProductCreated: boolean;
}

const SelectColor = ({
  item,
  isProductCreated,
  addImageToState,
  removeImageFromState,
}: SelectColorProps) => {
  const [isSelected, setIsSelected] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isProductCreated) {
      setIsSelected(false);
      setFile(null);
    }
  }, [isProductCreated]);

  const handleFileChange = useCallback(
    (value: File) => {
      setFile(value);
      addImageToState({ ...item, image: value });
    },
    [addImageToState, item]
  );

  const handleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsSelected(e.target.checked);

      if (!e.target.checked) {
        setFile(null);
        removeImageFromState(item);
      }
    },
    [item, removeImageFromState]
  );

  return (
    <div
      className="grid overflow-y-auto border-b-[1.2px]
    border-slate-200 items-center p-2"
    >
      <div className="flex flex-row gap-2 items-center h-[60px]">
        <input
          type="checkbox"
          id={item.color}
          checked={isSelected}
          onChange={handleCheck}
          className="cursor-pointer"
        />
        <label htmlFor={item.color} className="font-medium cursor-pointer">
          {item.color}
        </label>
      </div>
      <>
        {isSelected && !file && (
          <div className="col-span-2 text-center">
            <SelectImage item={item} handleFileChange={handleFileChange} />
          </div>
        )}
        {file && (
          <div className="flex flex-row gap-2 text-sm col-span-2 items-center justify-between">
            <p>{file?.name}</p>
            <div className="w-[70px]">
              <Button
                label="Cancel"
                onCLick={() => {
                  setFile(null);
                  removeImageFromState(item);
                }}
                small
                outline
              />
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default SelectColor;
