"use client";

import { useEffect } from "react";
import usePost from "@/hooks/usePost";
import Spinner from "./Spiner";
import Post from "./Post";
import NoMorePostsBanner from "@/components/NoMorePostsBanner";

export default function PostsList() {
  const { posts, isLoading, fetchFeedPosts } = usePost();

  useEffect(() => {
    fetchFeedPosts();
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
    <div className="space-y-8">
      <div className="gap-16 flex-nowrap grid grid-cols-1 lg:grid-cols-2 ">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
      <NoMorePostsBanner />
    </div>
  );
}
