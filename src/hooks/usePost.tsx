"use client";

import { useState, useCallback } from "react";
import { useAxios } from "./useAxios";
import { useRouter } from "next/navigation";

interface Post {
  _id: string;
  user_id: string;
  image_url: string;
  caption: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

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

  // Получение всех постов пользователя
  const fetchUserPosts = useCallback(async () => {
    const token = checkToken();
    if (!token) return;

    try {
      const { data, error } = await request<PostsResponse>({
        endpoint: "/api/post/all",
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
      console.error("Error fetching posts:", error);
    }
  }, [request]);

  // Получение одного поста по ID
  const fetchPostById = useCallback(
    async (postId: string) => {
      if (!postId) {
        console.error("[Post] Invalid post ID:", postId);
        return;
      }

      const token = checkToken();
      if (!token) return;

      try {
        const { data, error } = await request<PostResponse>({
          endpoint: `/api/post/single/${postId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (error) {
          throw new Error(error);
        }

        if (data?.post) {
          setCurrentPost(data.post);
          return data.post;
        }
      } catch (error) {
        console.error("[Post] Error fetching post:", error);
        setCurrentPost(null);
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
    async (postId: string) => {
      const token = checkToken();
      if (!token) return false;

      try {
        const { error } = await request({
          endpoint: `/api/post/${postId}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (error) {
          console.error("Delete post error:", error);
          return false;
        }

        setPosts((prev) => prev.filter((post) => post._id !== postId));
        if (currentPost?._id === postId) {
          setCurrentPost(null);
        }
        return true;
      } catch (error) {
        console.error("Delete post error:", error);
        return false;
      }
    },
    [request, currentPost]
  );

  return {
    posts,
    currentPost,
    isLoading,
    error,
    fetchUserPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
  };
}
