import HeroLogo from "@/components/HeroLogo";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <div className="border-b-[1px] border-b-borderColor pl-[44px]">
      <Link href="/login" className="w-[97px] h-[55px] block">
        <HeroLogo />
      </Link>
    </div>
  );
}
