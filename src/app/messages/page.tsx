"use client";

import ProfileBadge from "@/components/ProfileBadge";
import useUser from "@/hooks/useUser";
import React from "react";

export default function MessagesPage() {
  const { user } = useUser();

  return (
    <div className="ml-[245px] flex h-full">
      <div className="flex gap-4 py-9 px-6 max-w-[350px] flex-1 border-r border-borderColor">
        <ProfileBadge src={user?.profile_image} />
        <p>{user?.username}</p>
      </div>
    </div>
  );
}
