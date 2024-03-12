"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { User } from "@prisma/client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { AiOutlineGoogle } from "react-icons/ai";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";

import Input from "@/components/shared/input";
import Button from "@/components/shared/button";
import Heading from "@/components/shared/heading";
import { signUp } from "@/lib/actions/signUp";

type props = Omit<User, "createdAt" | "updatedAt" | "emailVerified"> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

const RegisterForm = ({ user }: { user: props | null }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      router.push("/cart");
      router.refresh();
    }
  }, [router, user]);

  const onSubmit: SubmitHandler<FieldValues> = (values) => {
    startTransition(() => {
      signUp(values)
        .then(({ error, success }) => {
          if (error) toast.error(error);

          if (success) {
            toast.success(success);
            router.push("/login");
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  if (user) {
    return <p className="text-center">Logged In. Redirecting...</p>;
  }

  return (
    <>
      <Heading title="Sign up for E~Shop" />
      <Button
        outline
        label="Sign up with Google"
        icon={AiOutlineGoogle}
        onCLick={() => signIn("google")}
      />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="name"
        label="Name"
        disabled={isPending}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="email"
        label="Email"
        disabled={isPending}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        disabled={isPending}
        register={register}
        errors={errors}
        required
        type="password"
      />
      <Button
        label={isPending ? "Loading" : "Sign Up"}
        onCLick={handleSubmit(onSubmit)}
        disabled={isPending}
      />
      <p className="text-sm">
        Already have an account?{" "}
        <Link className="underline" href="/login">
          Log In
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;
