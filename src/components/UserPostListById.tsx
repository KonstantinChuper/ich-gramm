"use client";

import usePost from "@/hooks/usePost";
import Image from "next/image";
import { useEffect, useState } from "react";
import ModalPost from "./ModalPost";
import { Post } from "@/types/Post";
import PictureLoading from "./PictureLoading";
import LikeIcon from "./icons/LikeIcon";
import MessageIcon from "./icons/MessageIcon";

interface UserPostListByIdProps {
  userId: string;
}

export default function UserPostListById({ userId }: UserPostListByIdProps) {
  const { posts, isLoading, error, fetchUserPostsById } = usePost();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUserPostsById(userId);
    }
  }, [userId]);

  useEffect(() => {
    const handleCloseModal = () => {
      setSelectedPost(null);
    };
    window.addEventListener("closePostModal", handleCloseModal);
    return () => {
      window.removeEventListener("closePostModal", handleCloseModal);
    };
  }, []);

  if (isLoading) {
    return <PictureLoading />;
  }

  if (error) {
    return <div className="pt-[87px] text-center">Ошибка загрузки постов: {error}</div>;
  }

  if (!posts || posts.length === 0) {
    return <div className="pt-[87px] text-center">No posts yet</div>;
  }

  return (
    <>
      <div className="pt-[87px] grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <div
            key={post._id}
            className="cursor-pointer relative group aspect-square"
            onClick={() => setSelectedPost(post)}
          >
            <div className="absolute inset-0">
              <Image
                src={post.image_url}
                alt={post.caption || "Post image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 33vw, 33vw"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-200" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex gap-8 text-white font-semibold">
                  <div className="flex items-center gap-2">
                    <LikeIcon />
                    <span>{post.likes_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageIcon />
                    <span>{post.comments_count || 0}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* <Image
              src={post.image_url}
              alt={post.caption || "post image"}
              width={350}
              height={350}
              className="object-cover aspect-square"
            /> */}
          </div>
        ))}
      </div>

      {selectedPost && (
        <ModalPost
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}
