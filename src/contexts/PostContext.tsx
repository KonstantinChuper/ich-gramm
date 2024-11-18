"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Post } from "@/types/Post";
import usePost from "@/hooks/usePost";

interface PostContextType {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
  updatePostLike: (postId: string, newLikesCount: number, isLiked: boolean) => void;
  getPostLikes: (postId: string) => number;
  getIsPostLiked: (postId: string) => boolean;
  fetchFeedPosts: () => Promise<void>;
  fetchUserPosts: () => Promise<void>;
}

const initialContext: PostContextType = {
  posts: [],
  isLoading: false,
  error: null,
  selectedPost: null,
  setSelectedPost: () => {},
  updatePostLike: () => {},
  getPostLikes: () => 0,
  getIsPostLiked: () => false,
  fetchFeedPosts: async () => {},
  fetchUserPosts: async () => {},
};

const PostContext = createContext<PostContextType>(initialContext);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const {
    posts,
    currentPost: selectedPost,
    isLoading,
    error,
    fetchFeedPosts,
    fetchUserPosts,
  } = usePost();
  const [localPosts, setLocalPosts] = useState<Post[]>(posts);
  const [localSelectedPost, setLocalSelectedPost] = useState<Post | null>(selectedPost);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  const setSelectedPost = (post: Post | null) => {
    setLocalSelectedPost(post);
  };

  const updatePostLike = (postId: string, newLikesCount: number, isLiked: boolean) => {
    setLocalPosts((currentPosts) =>
      currentPosts.map((post) =>
        post._id === postId ? { ...post, likes_count: newLikesCount } : post
      )
    );

    if (localSelectedPost?._id === postId) {
      setLocalSelectedPost((prev) => (prev ? { ...prev, likes_count: newLikesCount } : null));
    }

    setLikedPosts((prev) => ({
      ...prev,
      [postId]: isLiked,
    }));
  };

  const getPostLikes = (postId: string): number => {
    const post = localPosts.find((p) => p._id === postId);
    return post?.likes_count || 0;
  };

  const getIsPostLiked = (postId: string): boolean => {
    return likedPosts[postId] || false;
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
        getPostLikes,
        getIsPostLiked,
        fetchFeedPosts,
        fetchUserPosts,
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
