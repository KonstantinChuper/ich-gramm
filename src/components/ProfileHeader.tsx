"use client";

import React, { useMemo } from "react";
import ProfileBadge from "./ProfileBadge";
import useUser from "@/hooks/useUserAxios";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spiner";
import ActionButtons from "@/components/ActionButtons";
import StatsItem from "@/components/StatsItems";

interface ProfileHeaderProps {
  userId?: string;
}

export default function ProfileHeader({ userId }: ProfileHeaderProps) {
  const { user, isLoading, error, isCurrentUser } = useUser(userId);
  const router = useRouter();

  console.log("ProfileHeader userId:", userId);
  console.log("Current user:", user);
  console.log("Is current user:", isCurrentUser);
  console.log(user);

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

  const handleFollow = () => {
    // Логика подписки
    console.log("Follow clicked");
  };

  const handleMessage = () => {
    // Логика отправки сообщения
    console.log("Message clicked");
  };

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
