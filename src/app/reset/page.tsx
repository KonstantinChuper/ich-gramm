import React from "react";
import Header from "./Header";
import Form from "@/components/Form";
import lockIcon from "@/assets/lock-icon.svg";
import Image from "next/image";
import Input from "@/components/Input";
import Divider from "@/components/Divider";
import Link from "next/link";

export default function page() {
  return (
    <div>
      <Header />
      <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 56px)" }}>
        <div className="flex flex-col justify-center items-center w-full my-auto">
          <Form>
            <Image src={lockIcon} alt="lock icon" width={96} height={96} />
            <p className="font-semibold pt-[14px]">Trouble logging in?</p>
            <p className="text-[14px] leading-[18px] text-textGrayColor pt-[14px]">
              Enter your email, phone, or username and we'll send you a link to get back into your
              account.
            </p>
            <div className="pt-4">
              <Input placeholder="Email or Username" />
              <button className="btn btn-primary w-full mt-[16px]">Reset your password</button>
            </div>
            <Divider>or</Divider>
            <Link href="/register" className="pt-4 mb-[84px]">
              Create new account
            </Link>
          </Form>
          <Link
            href="/login"
            className="w-[350px] h-[44px] font-semibold bg-[#FAFAFA] border-[1px] border-t-0 border-borderColor flex justify-center items-center"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
