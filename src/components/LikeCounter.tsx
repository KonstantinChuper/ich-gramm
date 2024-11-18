"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import likeIcon from "@/assets/menu-icons/notification.svg";
import likeIconFilled from "@/assets/menu-icons/notification-filled.svg";
import messageIcon from "@/assets/message.svg";
import { useAxios } from "@/hooks/useAxios";
import useUser from "@/hooks/useUser";
import { usePostContext } from "@/contexts/PostContext";
import useNotifications from "@/hooks/useNotifications";
import { useNotificationContext } from "@/contexts/NotificationContext";


interface LikeCounterProps {
  postId: string;
}

export default function LikeCounter({ postId }: LikeCounterProps) {
  const { user: currentUser } = useUser();
  const { request } = useAxios();
  const { updatePostLike, getPostLikes, getIsPostLiked, posts } = usePostContext();
  const { createNotification } = useNotificationContext();
  const likesCount = getPostLikes(postId);
  const isLiked = getIsPostLiked(postId);
  const currentPost = posts.find((post) => post._id === postId);

  useEffect(() => {
    const checkIfLiked = async () => {
      const { data } = await request({
        endpoint: `/api/likes/${postId}/likes`,
        method: "GET",
      });

      const isPostLiked = (Array.isArray(data) ? data : []).some(
        (like: any) => like.user_id === currentUser?._id
      );

      updatePostLike(postId, likesCount, isPostLiked);
    };

    if (currentUser) {
      checkIfLiked();
    }
  }, [postId, currentUser]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!currentUser || !currentPost) return;

    try {
      if (isLiked) {
        await request({
          endpoint: `/api/likes/${postId}/unlike/${currentUser._id}`,
          method: "DELETE",
          data: {
            userId: currentUser._id,
            postId: postId,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
        updatePostLike(postId, likesCount - 1, false);
      } else {
        await request({
          endpoint: `/api/likes/${postId}/like/${currentUser._id}`,
          method: "POST",
          data: {
            userId: currentUser._id,
            postId: postId,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
        updatePostLike(postId, likesCount + 1, true);

        if (currentPost.user_id !== currentUser._id) {
          await createNotification(
            currentPost.user_id,
            "like",
            currentUser.username || "Someone"
          );
        }
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  return (
    <div className="">
      <div className="flex gap-[14px]">
        <button
          onClick={handleLikeClick}
          className={`transition-transform ${isLiked ? "scale-90" : "scale-100"}`}
        >
          <Image
            src={isLiked ? likeIconFilled : likeIcon}
            alt="heart icon"
            width={24}
            height={24}
          />
        </button>
        <Image src={messageIcon} alt="comment icon" width={24} height={24} />
      </div>
      <p className="pt-[8px] text-[12px] font-semibold">{likesCount} likes</p>
    </div>
  );
}
