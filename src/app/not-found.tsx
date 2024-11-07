import HeroImage from "@/components/HeroImage";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex justify-center gap-11 py-20 ml-[245px] px-6">
      <div className="max-w-[300px] max-h-[460px]">
        <HeroImage />
      </div>
      <div className="pt-[57px]">
        <h1 className="text-4xl font-bold">Oops! Page Not Found (404 Error)</h1>
        <p className="text-textGrayColor font-semibold leading-5 pt-[20px] max-w-[480px]">
          We're sorry, but the page you're looking for doesn't seem to exist. If you typed the URL
          manually, please double-check the spelling. If you clicked on a link, it may be outdated
          or broken.
        </p>
      </div>
    </div>
  );
}
