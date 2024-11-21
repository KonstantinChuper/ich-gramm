"use client";

import { useState } from "react";
import { getTimeAgo } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { countTextLetters } from "@/utils/helpers";
import type { Post } from "@/types/Post";
import LikeCounter from "./LikeCounter";
import ProfileBadge from "./ProfileBadge";
import useUser from "@/hooks/useUser";
import Image from "next/image";

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const { user: postAuthor } = useUser(post.user_id);
  const [showFull, setShowFull] = useState(false);
  const MAX_TEXT_LENGTH = 13;
  const router = useRouter();

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
    <div className="border-b border-borderColor pb-9">
      <div onClick={handleUserClick} className="flex gap-3 items-center cursor-pointer">
        <ProfileBadge
          src={postAuthor?.profile_image || "/default-profile-image.svg"}
          maxWidth={36}
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

      <Image
        src={post.image_url}
        alt="post image"
        width={550}
        height={555}
        priority={true}
        className="pt-[12px]"
      />

      <div className="pt-3">
        <LikeCounter postId={post._id} />
      </div>

      {post.caption && (
        <p className="text-3">
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
        <p className="text-xs text-textGrayColor mt-2">{countTextLetters(post.comments_count)}</p>
      )}
    </div>
  );
}
