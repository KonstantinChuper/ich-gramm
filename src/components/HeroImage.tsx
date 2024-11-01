import Image from "next/image";
import React from "react";

// interface HeroImageProps {
//   width: number;
//   height: number;
// }

export default function HeroImage() {
  return (
    <div className="max-w-[380px] max-h-[580px]">
      <Image
        src="/mobile-image.png"
        alt="hero image"
        width={380}
        height={580}
        objectFit="cover"
      />
    </div>
  );
}
