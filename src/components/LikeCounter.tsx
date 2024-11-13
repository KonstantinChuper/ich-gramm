"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import likeIcon from "@/assets/menu-icons/notification.svg";
import likeIconFilled from "@/assets/menu-icons/notification-filled.svg";
import messageIcon from "@/assets/message.svg";
import { useAxios } from "@/hooks/useAxios";
import useUser from "@/hooks/useUserAxios";
import { usePostContext } from "@/contexts/PostContext";

interface LikeCounterProps {
  postId: string;
  initialLikesCount: number;
}

export default function LikeCounter({ postId, initialLikesCount }: LikeCounterProps) {
  const { user: currentUser } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const { request } = useAxios();
  const { updatePostLike } = usePostContext();
  useEffect(() => {
    const checkIfLiked = async () => {
      const { data } = await request({
        endpoint: `/api/likes/${postId}/likes`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setIsLiked(
        (Array.isArray(data) ? data : []).some((like: any) => like.user_id === currentUser?._id) ||
          false
      );
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
        setLikesCount((prev) => prev - 1);
        const newCount = likesCount - 1;
        updatePostLike(postId, newCount); 
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
        setLikesCount((prev) => prev + 1);
        const newCount = likesCount + 1;
        updatePostLike(postId, newCount);
      }

      setIsLiked((prev) => !prev);
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
