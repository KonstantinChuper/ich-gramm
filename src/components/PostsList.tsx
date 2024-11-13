"use client";

import { useEffect } from "react";
import Spinner from "./Spiner";
import Post from "./Post";
import NoMorePostsBanner from "@/components/NoMorePostsBanner";
import ModalPost from "./ModalPost";
import { usePostContext } from "@/contexts/PostContext";

export default function PostsList() {
  const { posts, isLoading, selectedPost, setSelectedPost, fetchFeedPosts } = usePostContext();

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

  if (!posts || (posts.length === 0 && !isLoading)) {
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
