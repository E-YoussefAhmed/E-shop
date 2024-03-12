"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { categories, colors, uploadCloudinary } from "@/lib/utils";
import Input from "@/components/shared/input";
import Button from "@/components/shared/button";
import Heading from "@/components/shared/heading";
import TextArea from "@/components/shared/textarea";
import { createProduct } from "@/lib/actions/product";
import CategoryInput from "@/components/shared/category-input";
import CustomCheckBox from "@/components/shared/custom-checkbox";
import SelectColor from "@/components/shared/select-color";
import toast from "react-hot-toast";

export type ImageType = {
  color: string;
  colorCode: string;
  image: File | null;
};

export type UploadedImageType = {
  color: string;
  colorCode: string;
  image: string;
};

const AddProductForm = () => {
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<ImageType[] | null>(null);
  const [isProductCreated, setIsProductCreated] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      inStock: false,
      images: [],
      price: "",
    },
  });

  const setCustomValue = useCallback(
    (id: string, value: any) => {
      setValue(id, value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [setValue]
  );

  const category = watch("category");

  useEffect(() => {
    setCustomValue("images", images);
  }, [images, setCustomValue]);

  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages(null);
      setIsProductCreated(false);
    }
  }, [isProductCreated, reset]);

  const addImageToState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (!prev) return [value];

      return [...prev, value];
    });
  }, []);

  const removeImageFromState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (prev) {
        const filteredImages = prev.filter(
          (item) => item.color !== value.color
        );
        return filteredImages;
      }

      return prev;
    });
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // console.log(data);

    startTransition(async () => {
      let uploadedImages: UploadedImageType[] = [];

      if (!data.category) {
        toast.error("Category is not selected");
        return;
      }

      if (!data.images || data.images.length === 0) {
        toast.error("No selected image!");
        return;
      }

      toast("Creating product, please wait...");
      // upload images to cloudinary
      for (let i = 0; i < data.images.length; i++) {
        const url = await uploadCloudinary(data.images[i].image);
        uploadedImages.push({
          ...data.images[i],
          image: url,
        });
      }
      // console.log(uploadedImages);

      const productDate = {
        ...data,
        images: uploadedImages,
      };
      try {
        const { error, success } = await createProduct(productDate);

        if (error) {
          toast.error(error);
        }
        if (success) {
          toast.success(success);
          reset();
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <>
      <Heading title="Add a Product" center />
      <Input
        id="name"
        label="Name"
        disabled={isPending}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="price"
        label="Price"
        type="number"
        disabled={isPending}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="brand"
        label="Brand"
        disabled={isPending}
        register={register}
        errors={errors}
        required
      />
      <TextArea
        id="description"
        label="Description"
        disabled={isPending}
        register={register}
        errors={errors}
        required
      />
      <CustomCheckBox
        id="inStock"
        label="This Product is in stock"
        register={register}
        disabled={isPending}
      />
      <div className="w-full font-medium">
        <div className="mb-2 font-semibold">Select a Category</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50dvh] overflow-y-auto">
          {categories.map(
            (item) =>
              item.label !== "All" && (
                <div key={item.label} className="col-span-1">
                  <CategoryInput
                    label={item.label}
                    selected={category === item.label}
                    onClick={(category) => setCustomValue("category", category)}
                    icon={item.icon}
                  />
                </div>
              )
          )}
        </div>
      </div>
      <div className="w-full flex flex-col flex-wrap gap-4">
        <div>
          <div className="font-bold">
            Select the available product colors and upload their images.
          </div>
          <div className="text-sm">
            You must upload an image for each of the color selected otherwise
            your color selection will be ignored.
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {colors.map((item) => (
            <>
              <SelectColor
                key={item.color}
                item={item}
                addImageToState={addImageToState}
                removeImageFromState={removeImageFromState}
                isProductCreated={false}
              />
            </>
          ))}
        </div>
      </div>
      <Button
        label={isPending ? "Loading..." : "Add Product"}
        onCLick={handleSubmit(onSubmit)}
        disabled={isPending}
      />
    </>
  );
};

export default AddProductForm;
