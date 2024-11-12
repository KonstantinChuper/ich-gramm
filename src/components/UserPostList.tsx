"use client";

import usePost from "@/hooks/usePost";
import Image from "next/image";
import { useEffect, useState } from "react";
import ModalPost from "./ModalPost";
import { Post } from "@/types/Post";

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

if (isLoading) {
  return (
    <div className="pt-[87px] grid grid-cols-3 gap-1">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="relative aspect-square bg-gray-200 animate-pulse rounded-sm overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
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
