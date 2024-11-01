import React from "react";
import Image from "next/image";

interface ProfileBadgeProps {
  maxWidth?: number;
  maxHeight?: number;
  src: string;
  isStorie?: boolean;
}

export default function ProfileBadge({
  maxWidth = 24,
  maxHeight = 24,
  isStorie = false,
  src,
}: ProfileBadgeProps) {
  return (
    <>
      {isStorie ? (
        <div className="p-0.5 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 rounded-full">
          <div className="rounded-full bg-white p-0.5">
            <Image
              src={src}
              alt="profile image"
              width={maxWidth}
              height={maxHeight}
              className="rounded-full object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="rounded-full">
          <Image
            src={src}
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
