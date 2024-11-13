"use client";

import React, { createContext, useContext, useState } from "react";
import { Post } from "@/types/Post";
import usePost from "@/hooks/usePost";

interface PostContextType {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
  updatePostLike: (postId: string, newLikesCount: number) => void;
  fetchFeedPosts: () => Promise<void>;
}

const initialContext: PostContextType = {
  posts: [],
  isLoading: false,
  error: null,
  selectedPost: null,
  setSelectedPost: () => {},
  updatePostLike: () => {},
  fetchFeedPosts: async () => {},
};

const PostContext = createContext<PostContextType>(initialContext);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const { posts, currentPost: selectedPost, isLoading, error, fetchFeedPosts } = usePost();

  const [localPosts, setLocalPosts] = useState<Post[]>(posts);
  const [localSelectedPost, setLocalSelectedPost] = useState<Post | null>(selectedPost);

  React.useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  React.useEffect(() => {
    setLocalSelectedPost(selectedPost);
  }, [selectedPost]);

  const setSelectedPost = (post: Post | null) => {
    setLocalSelectedPost(post);
  };

  const updatePostLike = (postId: string, newLikesCount: number) => {
    setLocalPosts((currentPosts) =>
      currentPosts.map((post) =>
        post._id === postId ? { ...post, likes_count: newLikesCount } : post
      )
    );

    if (localSelectedPost?._id === postId) {
      setLocalSelectedPost((prev) => (prev ? { ...prev, likes_count: newLikesCount } : null));
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts: localPosts,
        isLoading,
        error,
        selectedPost: localSelectedPost,
        setSelectedPost,
        updatePostLike,
        fetchFeedPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
};
