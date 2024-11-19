"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import messageIcon from "@/assets/message.svg";
import { useAxios } from "@/hooks/useAxios";
import useUser from "@/hooks/useUser";
import { usePostContext } from "@/contexts/PostContext";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { NotificationsIcon } from "./icons/Icons";
import usePost from "@/hooks/usePost";
import { MessageIcon } from "./icons/Icons";

interface LikeCounterProps {
  postId: string;
}

export default function LikeCounter({ postId }: LikeCounterProps) {
  const { user: currentUser } = useUser();
  const { request } = useAxios();
  const { updatePostLike, getPostLikes, getIsPostLiked } = usePostContext();
  const { fetchPostById } = usePost();
  const { createNotification } = useNotificationContext();
  const likesCount = getPostLikes(postId);
  const isLiked = getIsPostLiked(postId);

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

    if (!currentUser) return;

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

        const currentPost = await fetchPostById(postId);

        if (currentPost && currentPost.user_id._id !== currentUser._id) {
          await createNotification(
            currentPost.user_id._id,
            "like",
            {
              username: currentUser.username,
              message: "liked your post",
            },
            currentUser.profile_image || "",
            currentPost.image_url || ""
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
          className={`transition-transform ${isLiked ? "scale-110" : "scale-100"}`}
        >
          <NotificationsIcon isFilled={isLiked} />
        </button>
        <MessageIcon />
      </div>
      <p className="pt-[8px] text-[12px] font-semibold">{likesCount} likes</p>
    </div>
  );
}
