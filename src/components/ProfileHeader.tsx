"use client";

import React from "react";
import ProfileBadge from "./ProfileBadge";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Spiner from "./Spiner";

export default function ProfileHeader() {
  const { user, isLoading, error, isCurrentUser } = useUser();
  const router = useRouter();

  if (isLoading) return <Spiner />;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="pt-[38px] flex gap-[95px]">
      <ProfileBadge
        src={user.profile_image || "/default-profile-image.svg"}
        maxWidth={150}
        maxHeight={150}
      />
      <div>
        <div className="flex gap-8 items-center">
          <h1 className="text-xl font-semibold">{user.username}</h1>
          {isCurrentUser ? (
            <button
              onClick={() => router.push("/profile/edit")}
              className="btn btn-secondary px-10 py-1 border"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button className="btn btn-primary px-10 py-1 border">Follow</button>
              <button className="btn btn-secondary px-10 py-1 border">Message</button>
            </div>
          )}
        </div>
        <div className="flex gap-10 my-4">
          <span>
            <strong>{user.posts_count}</strong> posts
          </span>
          <span>
            <strong>{user.followers_count}</strong> followers
          </span>
          <span>
            <strong>{user.following_count}</strong> following
          </span>
        </div>
        <div>
          <p className="font-semibold">{user.full_name}</p>
          <p className="text-sm">{user.bio}</p>
        </div>
      </div>
    </div>
  );
}
