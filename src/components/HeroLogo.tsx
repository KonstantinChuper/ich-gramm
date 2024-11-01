import React from "react";
import heroLogo from "@/assets/hero-logo.svg";
import Image from "next/image";

export default function HeroLogo() {
  return <Image src={heroLogo} alt="hero image" width={190} height={90} objectFit="cover" />;
}
