"use client";

import React, { useState } from "react";
import ProfileBadge from "./ProfileBadge";
import Image from "next/image";
import likeIcon from "@/assets/menu-icons/notification.svg";
import likeIconFilled from "@/assets/menu-icons/notification-filled.svg";
import messageIcon from "@/assets/message.svg";
import useUser from "@/hooks/useUserAxios";
import type { Post } from "@/types/Post";
import { getTimeAgo } from "@/utils/helpers";
import { useRouter } from "next/navigation";

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const { user } = useUser(post.user_id);
  const [isLiked, setIsLiked] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const MAX_TEXT_LENGTH = 13;
  const router = useRouter();

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
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
          src={user?.profile_image || "/default-profile-image.svg"}
          maxWidth={26}
          has_stories={user?.has_stories}
        />
        <div className="flex gap-1 text-xs">
          <p className="font-semibold">{user?.username}</p>
          <p className="text-textGrayColor">
            <span className="font-extrabold">&middot;</span> {getTimeAgo(post.created_at)}{" "}
            <span className="font-extrabold">&middot;</span>
          </p>
        </div>
      </div>

      <Image src={post.image_url} alt="post image" width={454} height={555} className="pt-[12px]" />

      <div className="pt-[12px] flex gap-[14px]">
        <button onClick={handleLikeClick}>
          <Image
            src={isLiked ? likeIconFilled : likeIcon}
            alt="heart icon"
            width={24}
            height={24}
          />
        </button>
        <Image src={messageIcon} alt="comment icon" width={24} height={24} />
      </div>

      <p className="pt-[8px] text-[12px] font-semibold">{post.likes_count} likes</p>

      {post.caption && (
        <p className="text-[12px]">
          <span className="font-semibold">{user?.username}</span> {formatCaption(post.caption)}
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
        <p className="text-xs text-textGrayColor mt-2">{post.comments_count} comments</p>
      )}
    </div>
  );
}
