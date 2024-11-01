import Link from "next/link";
import React from "react";

interface HaveJobBannerProps {
  children: React.ReactNode;
  linkText: string;
  to: string;
}

export default function HaveJobBanner({ children, linkText, to }: HaveJobBannerProps) {
  return (
    <div className="w-[350px] mt-[10px] border border-borderColor gap-[4px] flex items-center justify-center rounded-[1px] py-[22px]">
      {children}
      <Link href={to} className="text-primaryColor font-semibold">{linkText}</Link>
    </div>
  );
}
