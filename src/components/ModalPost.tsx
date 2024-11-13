"use client";

import Image from "next/image";
import ProfileBadge from "./ProfileBadge";
import { Post } from "@/types/Post";
import menuBtn from "@/assets/Menu-buttons.svg";
import { getTimeAgo } from "@/utils/helpers";
import PostForm from "./PostForm";
import CommentList from "./CommentList";
import { useEffect, useState } from "react";
import { useAxios } from "@/hooks/useAxios";
import { useRouter } from "next/navigation";

interface ModalPostProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

interface PostAuthor {
  username: string;
  profile_image?: string;
}

export default function ModalPost({ post, isOpen, onClose }: ModalPostProps) {
  const [postAuthor, setPostAuthor] = useState<PostAuthor | null>(null);
  const { request } = useAxios();
  const router = useRouter();

  useEffect(() => {
    const fetchPostAuthor = async () => {
      const { data } = await request<PostAuthor>({
        endpoint: `/api/user/${post.user_id}`,
        method: "GET",
      });
      if (data) {
        setPostAuthor(data);
      }
    };

    fetchPostAuthor();
  }, [post.user_id]);

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/profile/${post.user_id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 ml-[245px] flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-70" onClick={onClose} />

      {/* Modal window */}
      <div className="bg-white rounded-md w-full relative max-h-[650px] max-w-[1000px] z-50 mx-4 flex">
        {/* Left side - image */}
        <div className="flex-1 relative min-h-[650px] max-h-[650px] max-w-[577px]">
          <Image
            src={post.image_url}
            alt={post.caption || "Post image"}
            fill
            className="object-contain rounded-l-xl"
          />
        </div>

        {/* Right side - post information */}
        <div className="flex flex-col border-l border-borderColor max-w-[433px] flex-1">
          <div className="p-4 border-b border-borderColor flex justify-between">
            <div onClick={handleUserClick} className="flex items-center gap-3 cursor-pointer">
              <ProfileBadge
                src={postAuthor?.profile_image || "/default-profile-image.svg"}
                maxWidth={32}
              />
              <span className="font-semibold">{postAuthor?.username}</span>
            </div>
            <button>
              <Image src={menuBtn} alt="menu" width={24} height={24} />
            </button>
          </div>

          {/* Post caption */}
          {post.caption && (
            <div className="p-5">
              <div className="flex gap-3">
                <ProfileBadge
                  src={postAuthor?.profile_image || "/default-profile-image.svg"}
                  maxWidth={32}
                />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold mr-2 text-base">{postAuthor?.username}</span>
                  <span className="break-all whitespace-pre-line font-normal text-sm">
                    {post.caption}
                  </span>
                  <p className="text-xs text-textGrayColor pt-1">{getTimeAgo(post.created_at)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Post comments */}
          <div className="px-5 pb-5 pt-2 border-borderColor flex-1 overflow-y-auto">
            <CommentList postId={post._id} />
          </div>

          {/* Post form */}
          <div className="flex-0 relative z-50">
            <PostForm postId={post._id} />
          </div>
        </div>
      </div>
    </div>
  );
}
