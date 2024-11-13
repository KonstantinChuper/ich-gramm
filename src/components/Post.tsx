"use client";

import React, { useEffect, useState } from "react";
import ProfileBadge from "./ProfileBadge";
import Image from "next/image";
import likeIcon from "@/assets/menu-icons/notification.svg";
import likeIconFilled from "@/assets/menu-icons/notification-filled.svg";
import messageIcon from "@/assets/message.svg";
import useUser from "@/hooks/useUserAxios";
import type { Post } from "@/types/Post";
import { getTimeAgo } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { useAxios } from "@/hooks/useAxios";

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const { user: currentUser } = useUser();
  const { user: postAuthor } = useUser(post.user_id);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showFull, setShowFull] = useState(false);
  const MAX_TEXT_LENGTH = 13;
  const router = useRouter();
  const { request } = useAxios();

  useEffect(() => {
    const checkIfLiked = async () => {
      const { data } = await request({
        endpoint: `/api/likes/${post._id}/likes`,
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
  }, [post._id, currentUser]);

  const getCommentText = (count: number) => {
    return `${count} comment${count === 1 ? "" : "s"}`;
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!currentUser) return;

    try {
      if (isLiked) {
        // Убираем лайк
        await request({
          endpoint: `/api/likes/${post._id}/unlike/${currentUser._id}`,
          method: "DELETE",
          data: {
            userId: currentUser._id,
            postId: post._id,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
        setLikesCount((prev) => prev - 1);
      } else {
        // Ставим лайк
        await request({
          endpoint: `/api/likes/${post._id}/like/${currentUser._id}`,
          method: "POST",
          data: {
            userId: currentUser._id,
            postId: post._id,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
        setLikesCount((prev) => prev + 1);
      }

      setIsLiked((prev) => !prev);
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/profile/${post.user_id}`);
  };

  const handleShowFullClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFull((prev) => !prev);
  };

  const shouldShowMoreButton = (text: string) => {
    return text.length > MAX_TEXT_LENGTH;
  };

  const formatCaption = (text: string) => {
    if (!showFull && text.length > MAX_TEXT_LENGTH) {
      return `${text.slice(0, MAX_TEXT_LENGTH)}...`;
    }
    return text;
  };

  return (
    <div className="border-b border-borderColor pb-[37px]">
      <div onClick={handleUserClick} className="flex gap-3 items-center cursor-pointer">
        <ProfileBadge
          src={postAuthor?.profile_image || "/default-profile-image.svg"}
          maxWidth={26}
          has_stories={postAuthor?.has_stories}
        />
        <div className="flex gap-1 text-xs">
          <p className="font-semibold">{postAuthor?.username}</p>
          <p className="text-textGrayColor">
            <span className="font-extrabold">&middot;</span> {getTimeAgo(post.created_at)}{" "}
            <span className="font-extrabold">&middot;</span>
          </p>
        </div>
      </div>

      <Image src={post.image_url} alt="post image" width={454} height={555} className="pt-[12px]" />

      <div className="pt-[12px] flex gap-[14px]">
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

      {post.caption && (
        <p className="text-[12px]">
          <span className="font-semibold">{postAuthor?.username}</span>{" "}
          {formatCaption(post.caption)}
          {shouldShowMoreButton(post.caption) && (
            <button
              className="text-xs text-textGrayColor ml-1 hover:text-gray-600"
              onClick={handleShowFullClick}
            >
              {showFull ? " less" : " more"}
            </button>
          )}
        </p>
      )}

      {post.comments_count > 0 && (
        <p className="text-xs text-textGrayColor mt-2">{getCommentText(post.comments_count)}</p>
      )}
    </div>
  );
}
