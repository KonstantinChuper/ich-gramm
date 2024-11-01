"use client";

import React, { useState } from "react";
import ProfileBadge from "./ProfileBadge";
import { examplePost } from "@/data/posts";
import Image from "next/image";
export { examplePost } from "@/data/posts";
import likeIcon from "@/assets/menu-icons/notification.svg";
import likeIconFilled from "@/assets/menu-icons/notification-filled.svg";
import messageIcon from "@/assets/message.svg";

export default function Post() {
  const [isLiked, setIsLiked] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLikeClick = () => {
    setIsLiked((prev) => !prev);
  };

  const shouldShowMoreButton = (message: string) => {
    return message.length > 13;
  };

  return (
    <div className="border-b border-borderColor pb-[37px]">
      <div className="flex gap-3 items-center">
        <ProfileBadge src={examplePost.photoUrl} maxWidth={26} maxHeight={26} isStorie={true} />
        <div className="flex gap-1 text-xs">
          <p className="font-semibold">{examplePost.username}</p>
          <p className="text-textGrayColor">
            <span className="font-extrabold">&middot;</span> 2 wek{"  "}
            <span className="font-extrabold">&middot;</span>
          </p>
          <button className="text-primaryColor font-semibold pl-4">
            {examplePost.isFolowed ? "unfollow" : "follow"}
          </button>
        </div>
      </div>
      <Image
        src={examplePost.postImage}
        alt="post image"
        width={454}
        height={555}
        className="pt-[12px]"
      />
      <div className="pt-[12px] flex gap-[14px]">
        <button onClick={handleLikeClick}>
          <Image
            src={isLiked ? likeIconFilled : likeIcon}
            alt="heart icon"
            width={24}
            height={24}
          />
        </button>
        <button>
          <Image src={messageIcon} alt="heart icon" width={24} height={24} />
        </button>
      </div>
      <p className=" pt-[8px] text-[12px] font-semibold">{examplePost.likes} likes</p>
      {examplePost.description && (
        <p className="text-[12px]">
          <span className="font-semibold">{examplePost.username}</span> {examplePost.description}
        </p>
      )}
      {examplePost.comments.length > 0 && (
        <div className="pt-[17px]">
          <div className={`flex gap-2 text-xs pt-2 ${showFull ? "items-start" : "items-center"}`}>
            <p className="font-semibold">{examplePost.comments[0].user}</p>
            <p className={`${showFull ? "w-full" : "max-w-[80px] truncate"}`}>
              {examplePost.comments[0].message}
            </p>
            {shouldShowMoreButton(examplePost.comments[0].message) && (
              <button
                className="text-xs text-textGrayColor"
                onClick={() => {
                  setShowFull((prev) => !prev);
                }}
              >
                {showFull ? "less" : "more"}
              </button>
            )}
          </div>
          {examplePost.comments.length > 1 && (
            <button
              className="text-xs text-textGrayColor mt-2"
              onClick={() => setShowComments((prev) => !prev)}
            >
              {showComments ? "Hide comments" : `View all comments (${examplePost.comments.length})`}
            </button>
          )}
          {showComments && (
            <div className="pt-2">
              {examplePost.comments.slice(1).map((comment, index) => (
                <div key={index} className="flex gap-2 text-xs pt-2">
                  <p className="font-semibold">{comment.user}</p>
                  <p>{comment.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
