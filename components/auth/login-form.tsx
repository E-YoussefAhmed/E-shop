"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { User } from "@prisma/client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { AiOutlineGoogle } from "react-icons/ai";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";

import Input from "@/components/shared/input";
import Button from "@/components/shared/button";
import Heading from "@/components/shared/heading";
import { login } from "@/lib/actions/login";

type props = Omit<User, "createdAt" | "updatedAt" | "emailVerified"> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

const LoginForm = ({ user }: { user: props | null }) => {
  // const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
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
    console.log(values);

    setIsLoading(true);
    signIn("credentials", {
      ...values,
      redirect: false,
    })
      .then((callback) => {
        if (callback?.ok) {
          router.push("/cart");
          router.refresh();
          toast.success("Logged in successfully");
        }

        if (callback?.error) {
          toast.error(callback.error);
        }
      })
      .finally(() => setIsLoading(false));
    // startTransition(() => {
    //   login(values).then((data) => {
    //     setError(data.error);
    //     setSuccess(data.success);
    //   });
    // });
  };

  if (user) {
    return <p className="text-center">Logged In. Redirecting...</p>;
  }

  return (
    <>
      <Heading title="Sign in to E~Shop" />
      <Button
        outline
        label="Continue with Google"
        icon={AiOutlineGoogle}
        onCLick={() => signIn("google")}
      />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
      />
      <Button
        label={isLoading ? "Loading" : "Login"}
        onCLick={handleSubmit(onSubmit)}
        disabled={isLoading}
      />
      <p className="text-sm">
        Don&apos;t have an account?{" "}
        <Link className="underline" href="/register">
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
