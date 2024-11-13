import React from "react";
import Image from "next/image";

interface ProfileBadgeProps {
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  className?: string;
  src?: string | null;
  has_stories?: boolean;
}

export default function ProfileBadge({
  maxWidth = 24,
  className,
  has_stories = false,
  src,
}: ProfileBadgeProps) {
  const size = maxWidth;

  return (
    <>
      {has_stories ? (
        <div className="p-0.5 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 rounded-full">
          <div
            className={`rounded-full bg-white shrink-0 p-0.5 overflow-hidden ${className}`}
            style={{ width: size, height: size }}
          >
            <Image
              src={src || "/default-profile-image.svg"}
              alt="profile image"
              width={size}
              height={size}
              className="rounded-full object-cover w-full h-full"
              priority
            />
          </div>
        </div>
      ) : (
        <div
          className={`rounded-full shrink-0 overflow-hidden`}
          style={{ width: size, height: size }}
        >
          <Image
            src={src || "/default-profile-image.svg"}
            alt="profile image"
            width={size}
            height={size}
            className="rounded-full object-cover w-full h-full"
            priority
          />
        </div>
      )}
    </>
  );
}
