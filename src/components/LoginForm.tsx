"use client";

import React, { useState } from "react";
import HeroLogo from "./HeroLogo";
import Input from "./Input";
import Divider from "./Divider";
import Form from "./Form";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);
      router.push("/");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="w-full h-full flex flex-col items-center">
        <HeroLogo />
        <div className="w-full flex flex-col gap-[6px]">
          <Input
            placeholder="Uesrname or email"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="btn btn-primary w-full mt-[6px]">
            Log in
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
