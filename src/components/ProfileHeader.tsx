"use client";

import React, { useEffect, useMemo } from "react";
import ProfileBadge from "./ProfileBadge";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spiner";
import ActionButtons from "@/components/ActionButtons";
import StatsItem from "@/components/StatsItems";
import { useFollow } from "@/hooks/useFollow";

interface ProfileHeaderProps {
  userId?: string;
}

export default function ProfileHeader({ userId }: ProfileHeaderProps) {
  const { user, isLoading, error, isCurrentUser, fetchUser } = useUser(userId);
  const { isFollowing, checkFollowStatus, handleFollow } = useFollow({
    targetUserId: userId,
    onFollowChange: fetchUser,
  });
  const router = useRouter();

  const userStats = useMemo(() => {
    if (!user) return [];

    return [
      { label: "posts", value: user.posts_count },
      { label: "followers", value: user.followers_count },
      { label: "following", value: user.following_count },
    ];
  }, [user]);

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleMessage = () => {
    if (user) {
      const chatUser = {
        _id: user._id,
        username: user.username,
        profile_image: user.profile_image,
      };

      const existingChats = JSON.parse(localStorage.getItem("recentChats") || "[]");
      const isExisting = existingChats.some((chat: any) => chat._id === user._id);

      if (!isExisting) {
        existingChats.unshift(chatUser);
        localStorage.setItem("recentChats", JSON.stringify(existingChats.slice(0, 20)));
      }
    }

    router.push("/messages");
  };

  useEffect(() => {
    const handlePostCreated = () => {
      fetchUser();
    };
    window.addEventListener("postCreated", handlePostCreated);
    return () => window.removeEventListener("postCreated", handlePostCreated);
  }, [fetchUser]);

  useEffect(() => {
    if (!isCurrentUser && userId) {
      checkFollowStatus();
    }
  }, [isCurrentUser, userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">Error: {error}</div>;
  }

  if (!user) {
    return <div className="text-gray-500 p-4 text-center">User not found</div>;
  }

  return (
    <div className="pt-[38px] flex lg:gap-[95px] gap-5">
      <ProfileBadge
        src={user.profile_image || "/default-profile-image.svg"}
        maxWidth={150}
        maxHeight={150}
        className="shrink-0"
      />

      <div className="flex-1">
        <div className="flex items-center gap-8 flex-wrap">
          <h1 className="text-xl font-semibold">{user.username}</h1>
          <ActionButtons
            isCurrentUser={isCurrentUser}
            isFollowing={isFollowing}
            onEditProfile={handleEditProfile}
            onFollow={handleFollow}
            onMessage={handleMessage}
            onLogout={handleLogout}
          />
        </div>

        <div className="flex gap-10 my-4 flex-wrap">
          {userStats.map((stat) => (
            <StatsItem key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>

        <div className="space-y-1">
          {user.full_name && <p className="font-semibold">{user.full_name}</p>}
          {user.bio && <p className="text-sm whitespace-pre-wrap">{user.bio}</p>}
        </div>
      </div>
    </div>
  );
}
