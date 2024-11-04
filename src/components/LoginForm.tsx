"use client";

import React, { useState } from "react";
import HeroLogo from "./HeroLogo";
import Input from "./Input";
import Divider from "./Divider";
import Form from "./Form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formValidation } from "@/utils/formValidation";
import { useFetch } from "@/hooks/useFetch";

interface LoginFormData {
  username: string;
  password: string;
}

type AuthResponse = {
  token: string;
  user: Record<string, any>; // упрощенная типизация для user
};

export default function LoginForm() {
  const router = useRouter();
  const { fetchData, isLoading, error } = useFetch();

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const [isValid, tempErrors] = formValidation<LoginFormData>(formData);
    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const response = await fetchData<AuthResponse>({
        endpoint: "/api/auth/login",
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response?.token) {
        localStorage.setItem("token", response.token);
        router.push("/");
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="w-full h-full flex flex-col items-center">
        <HeroLogo />
        <div className="w-full flex flex-col gap-[6px]">
          <Input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

          <Input
            name="password"
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <button type="submit" className="btn btn-primary w-full mt-[6px]" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </button>

          <Divider>or</Divider>
        </div>
      </div>
      <Link href="/reset" className="pb-[23px] pt-[60px] text-linkColor">
        Forgot password?
      </Link>
    </Form>
  );
}
