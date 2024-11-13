"use client";

import React, { createContext, useContext, useState } from "react";
import { Post } from "@/types/Post";
import { useAxios } from "@/hooks/useAxios";

interface PostContextType {
  posts: Post[];
  isLoading: boolean;
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
  fetchPosts: () => Promise<void>;
  updatePostLikes: (postId: string, newLikesCount: number) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { request } = useAxios();

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data } = await request<Post[]>({
        endpoint: "/api/user/feed",
        method: "GET",
      });
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePostLikes = (postId: string, newLikesCount: number) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post._id === postId ? { ...post, likes_count: newLikesCount } : post
      )
    );

    if (selectedPost?._id === postId) {
      setSelectedPost((prev) => (prev ? { ...prev, likes_count: newLikesCount } : null));
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        isLoading,
        selectedPost,
        setSelectedPost,
        fetchPosts,
        updatePostLikes,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
};
