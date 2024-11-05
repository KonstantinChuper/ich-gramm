import React from "react";
import Image from "next/image";

interface ProfileBadgeProps {
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  className?: string;
  src?: string;
  has_stories?: boolean;
}

export default function ProfileBadge({
  maxWidth = 24,
  maxHeight = 24,
  className,
  has_stories = false,
  src,
}: ProfileBadgeProps) {
  return (
    <>
      {has_stories ? (
        <div className="p-0.5 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 rounded-full">
          <div
            className={`rounded-full bg-white shrink-0 p-0.5 ${className}`}
            style={{ maxWidth, maxHeight }}
          >
            <Image
              src={src || "/default-profile-image.svg"}
              alt="profile image"
              width={maxWidth}
              height={maxHeight}
              className="rounded-full object-cover"
            />
          </div>
        </div>
      ) : (
        <div
          className={`rounded-full shrink-0`}
        >
          <Image
            src={src || "/default-profile-image.svg"}
            alt="profile image"
            width={maxWidth}
            height={maxHeight}
            className="rounded-full object-cover"
          />
        </div>
      )}
    </>
  );
}
