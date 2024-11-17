"use client";

import { useState, useCallback } from "react";
import { useAxios } from "./useAxios";
import { useRouter } from "next/navigation";
import { Post } from "@/types/Post";

interface PostResponse {
  post: Post;
}

interface PostsResponse {
  posts: Post[];
}

export default function usePost() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const { request, isLoading, error } = useAxios();
  const router = useRouter();

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return null;
    }
    return token;
  };

  const fetchUserPosts = useCallback(async () => {
    const token = checkToken();
    if (!token) return;

    try {
      const { data, error } = await request<{ data: Post[] }>({
        endpoint: "/api/post/all",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (error) throw new Error(error);

      if (data && "data" in data) {
        setPosts(data.data);
      } else if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  }, [request]);

  const fetchUserPostsById = useCallback(
    async (userId: string) => {
      const token = checkToken();
      if (!token) return;

      try {
        const { data, error } = await request<{ data: Post[] }>({
          endpoint: `/api/post/user/${userId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response data:", data);

        if (error) throw new Error(error);

        if (data && "data" in data) {
          setPosts(data.data);
        } else if (Array.isArray(data)) {
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    },
    [request]
  );

  // Создание нового поста
  const createPost = useCallback(
    async (formData: FormData) => {
      const token = checkToken();
      if (!token) return false;

      try {
        const { data, error } = await request<PostResponse>({
          endpoint: "/api/post",
          method: "POST",
          data: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (error) {
          console.error("Create post error:", error);
          return false;
        }

        if (data?.post) {
          setPosts((prev) => [data.post, ...prev]);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Create post error:", error);
        return false;
      }
    },
    [request]
  );

  // Обновление поста
  const updatePost = useCallback(
    async (postId: string, caption: string) => {
      const token = checkToken();
      if (!token) return false;

      try {
        const { data, error } = await request<PostResponse>({
          endpoint: `/api/post/${postId}`,
          method: "PUT",
          data: { caption },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (error) {
          console.error("Update post error:", error);
          return false;
        }

        if (data?.post) {
          setPosts((prev) => prev.map((post) => (post._id === postId ? data.post : post)));
          setCurrentPost(data.post);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Update post error:", error);
        return false;
      }
    },
    [request]
  );

  // Удаление поста
  const deletePost = useCallback(
    async (postId: string, payload: { postId: string }) => {
      const token = checkToken();
      if (!token) return false;

      try {
        const { error } = await request({
          endpoint: `/api/post/${postId}`,
          method: "DELETE",
          data: payload,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (error) {
          console.error("Delete post error:", error);
          return false;
        }

        setPosts((prev) => prev.filter((post) => post._id !== postId));
        return true;
      } catch (error) {
        console.error("Delete post error:", error);
        return false;
      }
    },
    [request]
  );

  // Получение ленты постов
  const fetchFeedPosts = useCallback(async () => {
    const token = checkToken();
    if (!token) return;

    try {
      const { data, error } = await request<PostsResponse>({
        endpoint: "/api/post/feed",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (error) {
        throw new Error(error);
      }

      if (data?.posts) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  }, [request]);

  // Получение постов для explore
  const fetchExplorePosts = useCallback(async () => {
    const token = checkToken();
    if (!token) return;

    try {
      const { data, error } = await request<PostsResponse>({
        endpoint: "/api/post/feed",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (error) {
        throw new Error(error);
      }

      if (data?.posts) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  }, [request]);

  return {
    posts,
    currentPost,
    isLoading,
    error,
    fetchUserPosts,
    fetchUserPostsById,
    createPost,
    updatePost,
    deletePost,
    fetchFeedPosts,
    fetchExplorePosts,
  };
}
