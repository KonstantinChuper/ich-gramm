"use client";

import { useEffect, useState } from "react";
import { Post } from "@/types/Post";
import Image from "next/image";
import usePost from "@/hooks/usePost";
import Spinner from "@/components/Spiner";
import LikeIcon from "@/components/icons/LikeIcon";
import Container from "@/components/Container";
import ModalPost from "@/components/ModalPost";
import MessageIcon from "@/components/icons/MessageIcon";

export default function ExplorePage() {
  const { posts, isLoading, fetchExplorePosts } = usePost();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchExplorePosts();
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
      <Container>
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner />
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="935px" className="!mr-0">
      <div className="grid grid-cols-3 auto-rows-[293px] gap-1 my-20">
        {posts.map((post, index) => {
          const blockNumber = Math.floor(index / 12);
          const positionInBlock = index % 12;
          const isFirstBlockPattern =
            blockNumber % 2 === 0 && (positionInBlock === 2 || positionInBlock === 5);
          const isSecondBlockPattern =
            blockNumber % 2 === 1 && (positionInBlock === 0 || positionInBlock === 3);
          const isLarge = isFirstBlockPattern || isSecondBlockPattern;

          return (
            <div
              key={post._id}
              className={`relative bg-bgColorLight group cursor-pointer ${
                isLarge ? "row-span-2" : ""
              }`}
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
            </div>
          );
        })}
      </div>

      {selectedPost && (
        <ModalPost
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </Container>
  );
}
