"use client";

import { useState } from "react";
import { formValidation } from "@/utils/formValidation";
import { useAxios } from "@/hooks/useAxios";
import { useRouter } from "next/navigation";
import HaveJobBanner from "@/components/HaveJobBanner";
import HeroLogo from "@/components/HeroLogo";
import Input from "@/components/Input";
import Form from "@/components/Form";
import Link from "next/link";

interface RegisterFormData {
  email: string;
  full_name: string;
  username: string;
  password: string;
}

interface RegisterResponse {
  token: string;
  success: boolean;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    full_name: "",
    username: "",
    password: "",
  });

  const { request, isLoading, error } = useAxios();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const [isValid, tempErrors] = formValidation<RegisterFormData>(formData);
    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (validate()) {
        const { data, error } = await request<RegisterResponse>({
          endpoint: "/api/auth/register",
          method: "POST",
          data: formData,
        });

        if (data?.token) {
          localStorage.setItem("token", data.token);
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col justify-center items-center w-full my-auto">
        <Form onSubmit={handleSubmit}>
          <div className="w-full flex flex-col items-center justify-center">
            <HeroLogo />
            <p className="text-center text-textGrayColor font-semibold">
              Sign up to see photos and videos from your friends.
            </p>
            <div className="flex flex-col gap-[6px] w-full pt-9">
              <Input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}

              <Input
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
              />
              {errors.full_name && <p className="text-red-500">{errors.full_name}</p>}

              <Input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <p className="text-red-500">{errors.username}</p>}

              <Input
                name="password"
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500">{errors.password}</p>}
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

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
                </Link>
              </p>
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="btn btn-primary w-full my-[26px]">
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
        </Form>
        <HaveJobBanner to="/login" linkText="Log in">
          Have an account?
        </HaveJobBanner>
      </div>
    </div>
  );
}
