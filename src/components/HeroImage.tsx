import Image from "next/image";

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
