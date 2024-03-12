"use client";

import toast from "react-hot-toast";
import { useTransition } from "react";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Input from "@/components/shared/input";
import Button from "@/components/shared/button";
import Heading from "@/components/shared/heading";
import { addProductRating } from "@/lib/actions/product";
import { ExtendedProduct } from "@/components/shared/product-details";

const AddRating = ({ product }: { product: ExtendedProduct }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      comment: "",
      rating: 0,
    },
  });

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldTouch: true,
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);

    startTransition(() => {
      if (data.rating === 0) {
        toast.error("No rating selected");
        return;
      }
      addProductRating(product, data.comment, data.rating)
        .then((res) => {
          if (res?.error) {
            toast.error(res?.error);
          }
          if (res?.review) {
            toast.success("Review added successfully");
            reset();
          }
        })
        .catch((error) => console.log(error));
    });
  };

  return (
    <div className="flex flex-col gap-2 max-w-[500px]">
      <Heading title="Rate this product" />
      <Rating
        onChange={(event, newValue) => {
          setCustomValue("rating", newValue);
        }}
      />
      <Input
        id="comment"
        label="Comment"
        disabled={isPending}
        register={register}
        errors={errors}
        required
      />
      <Button
        label={isPending ? "Loading..." : "Rate Product"}
        onCLick={handleSubmit(onSubmit)}
        disabled={isPending}
      />
    </div>
  );
};

export default AddRating;
