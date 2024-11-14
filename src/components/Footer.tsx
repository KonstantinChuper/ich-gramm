import React from "react";
import { menuItems } from "@/data/menuItems";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="z-0 text-textGrayColor flex flex-col gap-[48px] items-center pt-5 pb-[61px] ml-[245px] h-[158px] bg-white 2xl:mr-[245px]">
      <nav className="flex gap-[40px] justify-center">
        {menuItems.map((item, index) => (
          <Link href={item.href} key={index}>
            {item.label}
          </Link>
        ))}
      </nav>
      <p>© 2024 ICHgram</p>
    </footer>
  );
}
