"use client";

import { useEffect } from "react";
import { useAxios } from "@/hooks/useAxios";
import { useRouter } from "next/navigation";
import { usePostContext } from "@/contexts/PostContext";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { NotificationsIcon, MessageIcon } from "./icons/Icons";
import { Post } from "@/types/Post";
import usePost from "@/hooks/usePost";
import useUser from "@/hooks/useUser";

interface LikeCounterProps {
  postId: string;
}

interface Like {
  _id: string;
  user_id: string;
  post_id: string;
}

interface PostUser {
  _id: string;
  username: string;
  profile_image?: string;
}

interface PostWithUser extends Omit<Post, "user_id"> {
  user_id: PostUser;
}

export default function LikeCounter({ postId }: LikeCounterProps) {
  const { user: currentUser } = useUser();
  const { request } = useAxios();
  const { updatePostLike, getPostLikes, getIsPostLiked } = usePostContext();
  const { fetchPostById } = usePost();
  const { createNotification } = useNotificationContext();
  const router = useRouter();
  const likesCount = getPostLikes(postId);
  const isLiked = getIsPostLiked(postId);

  useEffect(() => {
    const checkIfLiked = async () => {
      const { data } = await request<Like[]>({
        endpoint: `/api/likes/${postId}/likes`,
        method: "GET",
      });

      const isPostLiked = (Array.isArray(data) ? data : []).some(
        (like: Like) => like.user_id === currentUser?._id
      );

      updatePostLike(postId, likesCount, isPostLiked);
    };

    if (currentUser) {
      checkIfLiked();
    }
  }, [postId, currentUser]);

  const handleLikeClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
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

        const currentPost = (await fetchPostById(postId)) as PostWithUser | null;

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

  const handleMessageClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const currentPost = (await fetchPostById(postId)) as PostWithUser | null;

    if (currentPost && currentPost.user_id._id !== currentUser?._id) {
      const chatUser = {
        _id: currentPost.user_id._id,
        username: currentPost.user_id.username,
        profile_image: currentPost.user_id.profile_image,
      };

      const existingChats = JSON.parse(localStorage.getItem("recentChats") || "[]");
      const isExisting = existingChats.some((chat: any) => chat._id === chatUser._id);

      if (!isExisting) {
        existingChats.unshift(chatUser);
        localStorage.setItem("recentChats", JSON.stringify(existingChats.slice(0, 20)));
      }

      router.push("/messages");
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
        <button onClick={handleMessageClick}>
          <MessageIcon />
        </button>
      </div>
      <p className="pt-[8px] text-[12px] font-semibold">{likesCount} likes</p>
    </div>
  );
}
