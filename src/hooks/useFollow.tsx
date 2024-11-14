"use client";

import { useCallback, useEffect, useState } from "react";
import { useAxios } from "./useAxios";
import { useRouter } from "next/navigation";
import useUser from "./useUser";

interface UseFollowProps {
  targetUserId?: string;
  onFollowChange?: () => void;
}

// Определяем тип для пользователя
interface FollowedUser {
  _id: string;
  username: string;
  profile_image?: string;
}

// Определяем тип для подписки
interface Follow {
  _id: string;
  follower_user_id: string;
  followed_user_id: FollowedUser | string; // может быть объектом или строкой
}

export function useFollow({ targetUserId, onFollowChange }: UseFollowProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const { request, isLoading } = useAxios();
  const { getCurrentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (targetUserId) {
      checkFollowStatus();
    }
  }, [targetUserId]);

  // Проверка статуса подписки
  const checkFollowStatus = useCallback(async () => {
    if (!targetUserId) return;

    const currentUser = await getCurrentUser();
    if (!currentUser) return;

    try {
      const { data } = await request<Follow[]>({
        endpoint: `/api/follow/${currentUser._id}/following`,
        method: "GET",
      });

      if (data && Array.isArray(data)) {
        const isUserFollowing = data.some((follow) => {
          // Проверяем, является ли followed_user_id объектом или строкой
          const followedId =
            typeof follow.followed_user_id === "object"
              ? follow.followed_user_id._id
              : follow.followed_user_id;

          return followedId === targetUserId;
        });

        setIsFollowing(isUserFollowing);
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  }, [targetUserId, request, getCurrentUser]);

  // Подписка/отписка на пользователя
  const handleFollow = useCallback(async () => {
    if (!targetUserId) {
      router.push("/login");
      return;
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }

    try {
      const { error } = await request({
        endpoint: isFollowing
          ? `/api/follow/${currentUser._id}/unfollow/${targetUserId}`
          : `/api/follow/${currentUser._id}/follow/${targetUserId}`,
        method: isFollowing ? "DELETE" : "POST",
        data: {
          follower_user_id: currentUser._id,
          followed_user_id: targetUserId,
        },
      });

      if (!error) {
        setIsFollowing(!isFollowing);
        await checkFollowStatus();
        onFollowChange?.();
      }
    } catch (error) {
      console.error("Error handling follow:", error);
    }
  }, [targetUserId, isFollowing, request, router, onFollowChange, getCurrentUser]);

  return {
    isFollowing,
    isLoading,
    checkFollowStatus,
    handleFollow,
  };
}
