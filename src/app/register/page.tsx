import React from "react";
import Form from "@/components/Form";
import HeroLogo from "@/components/HeroLogo";
import Input from "@/components/Input";
import Link from "next/link";
import HaveJobBanner from "@/components/HaveJobBanner";
import { useForm } from "react-hook-form";

type FormValues = {
  email: string;
  fullName: string;
  username: string;
  password: string;
};

export default function page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col justify-center items-center w-full my-auto">
        <Form>
          <div className="w-full flex flex-col items-center justify-center">
            <HeroLogo />
            <p className="text-center text-textGrayColor font-semibold">
              Sign up to see photos and videos from your friends.
            </p>
            <div className="flex flex-col gap-[6px] w-full pt-9">
              <Input
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              <Input
                placeholder="Full Name"
                {...register("fullName", { required: "Full Name is required" })}
              />
              {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}
              <Input
                placeholder="Username"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && <p className="text-red-500">{errors.username.message}</p>}
              <Input
                placeholder="Password"
                type="password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <div className="flex flex-col items-center gap-[18px] text-[12px] leading-4 pt-[27px] text-textGrayColor">
              <p>
                People who use our service may have uploaded your contact information to Instagram.{" "}
                <Link href="/terms" className="text-linkColor">
                  Learn more
                </Link>
              </p>
              <p>
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-linkColor">
                  Terms
                </Link>
                ,{" "}
                <Link href="/privay-policy" className="text-linkColor">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/cookies-policy" className="text-linkColor">
                  Cookies Policy.
                </Link>{" "}
              </p>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full my-[26px]">
            Sign up
          </button>
        </Form>
        <HaveJobBanner to="/login" linkText="Log in">
          Have an account?
        </HaveJobBanner>
      </div>
    </div>
  );
}
