"use client";

import { useEffect, useState } from "react";
import usePost from "@/hooks/usePost";
import Spinner from "./Spiner";
import Post from "./Post";
import NoMorePostsBanner from "@/components/NoMorePostsBanner";
import ModalPost from "./ModalPost";
import { Post as PostType } from "@/types/Post";

export default function PostsList() {
  const { posts, isLoading, fetchFeedPosts } = usePost();
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);

  useEffect(() => {
    fetchFeedPosts();
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
    return <Spinner />;
  } 

  if (!posts || posts.length === 0 && !isLoading) {
    return (
      <div className="text-center py-8">
        <p>No posts in your feed yet.</p>
        <p className="text-sm text-gray-500">Try following more users to see their posts here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="gap-16 flex-nowrap grid grid-cols-1 lg:grid-cols-2">
          {posts.map((post) => (
            <div key={post._id} onClick={() => setSelectedPost(post)} className="cursor-pointer">
              <Post post={post} />
            </div>
          ))}
        </div>
        <NoMorePostsBanner />
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
