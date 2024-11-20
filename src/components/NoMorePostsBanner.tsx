import Image from "next/image";

export default function NoMorePostsBanner() {
  return (
    <div className="flex flex-col justify-center items-center pt-12 pb-14">
      <Image
        src={"/no-more-posts-banner-image.svg"}
        alt="banner"
        width={83}
        height={83}
      />
      <p className="text-base">You've seen all the updates</p>
      <p className="text-xs text-textGrayColor">You have viewed all new publications</p>
    </div>
  );
}
