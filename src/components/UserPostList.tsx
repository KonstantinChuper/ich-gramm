"use client";

import usePost from "@/hooks/usePost";
import Image from "next/image";
import { useEffect, useState } from "react";
import ModalPost from "./ModalPost";
import { Post } from "@/types/Post";
import PictureLoading from "./PictureLoading";

export default function UserPostList() {
  const { posts, isLoading, error, fetchUserPosts } = usePost();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchUserPosts();
  }, []);

  useEffect(() => {
    const handleCloseModal = () => {
      setSelectedPost(null);
    };
    window.addEventListener("closePostModal", handleCloseModal);
    return () => {
      window.removeEventListener("closePostModal", handleCloseModal);
    };
  }, []);

  useEffect(() => {
    const handlePostCreated = () => {
      fetchUserPosts();
    };

    window.addEventListener("postCreated", handlePostCreated);
    return () => {
      window.removeEventListener("postCreated", handlePostCreated);
    };
  }, [fetchUserPosts]);

  if (isLoading) {
    return <PictureLoading />;
  }

  if (error) {
    return <div className="pt-[87px] text-center">Ошибка загрузки постов: {error}</div>;
  }

  if (!posts || posts.length === 0) {
    return <div className="pt-[87px] text-center">You don't have any posts yet</div>;
  }

  return (
    <>
      <div className="pt-[87px] grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <div
            key={post._id}
            className="cursor-pointer relative aspect-square"
            onClick={() => setSelectedPost(post)}
          >
            <Image
              src={post.image_url}
              alt={post.caption || "post image"}
              width={350}
              height={350}
              className="object-cover aspect-square"
            />
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
