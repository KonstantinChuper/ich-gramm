"use client";

import { useState, useEffect } from "react";
import { useAxios } from "./useAxios";
import { Comment } from "@/types/Comments";
import useUser from "./useUserAxios";

interface UseCommentsProps {
  postId: string;
}

interface CommentFromServer {
  _id: string;
  post_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
}

interface UseCommentsReturn {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  addComment: (text: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  fetchComments: () => Promise<void>;
}

interface UserFromServer {
  _id: string;
  username: string;
  profile_image?: string;
}

export default function useComments({ postId }: UseCommentsProps): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const { request, isLoading, error } = useAxios();
  const { user: currentUser, userAvatar } = useUser();

  const fetchUserData = async (userId: string): Promise<UserFromServer | null> => {
    const { data } = await request<UserFromServer>({
      endpoint: `/api/user/${userId}`,
      method: "GET",
    });
    return data;
  };

  const fetchComments = async () => {
    const token = localStorage.getItem("token");

    const { data: commentsData, error } = await request<CommentFromServer[]>({
      endpoint: `/api/comment/${postId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!error && commentsData) {
      const userDataCache = new Map<string, { username: string; avatar_url: string }>();

      const commentsWithUserData = await Promise.all(
        commentsData.map(async (comment) => {
          let userData;

          if (comment.user_id === currentUser?._id) {
            userData = {
              username: currentUser.username,
              avatar_url: userAvatar,
            };
          } else {
            if (!userDataCache.has(comment.user_id)) {
              const fetchedUser = await fetchUserData(comment.user_id);
              if (fetchedUser) {
                userDataCache.set(comment.user_id, {
                  username: fetchedUser.username,
                  avatar_url: fetchedUser.profile_image || "/default-profile-image.svg",
                });
              }
            }
            userData = userDataCache.get(comment.user_id) || {
              username: "Unknown User",
              avatar_url: "/default-profile-image.svg",
            };
          }

          return {
            id: comment._id,
            post_id: comment.post_id,
            user_id: comment.user_id,
            comment_text: comment.comment_text,
            created_at: comment.created_at,
            user: userData,
          };
        })
      );

      setComments(commentsWithUserData);
    }
  };

  const addComment = async (text: string) => {
    if (!currentUser) return;
    const token = localStorage.getItem("token");

    try {
      const { data, error } = await request<CommentFromServer>({
        endpoint: `/api/comment/${postId}`,
        method: "POST",
        data: {
          comment_text: text,
          user_id: currentUser._id,
          post_id: postId,
          created_at: new Date(),
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (error) {
        console.error("Error creating comment:", error);
        throw new Error(error);
      }

      if (data) {
        const newComment: Comment = {
          id: data._id,
          post_id: postId,
          user_id: currentUser._id,
          comment_text: text,
          created_at: data.created_at || new Date().toISOString(),
          user: {
            username: currentUser.username,
            avatar_url: userAvatar || "/default-profile-image.svg",
          },
        };

        setComments((prev) => [...prev, newComment]);
        await fetchComments();
      }
    } catch (error) {
      console.error("Error in addComment:", error);
      throw error;
    }
  };

  const deleteComment = async (commentId: string) => {
    const token = localStorage.getItem("token");

    const { error } = await request({
      endpoint: `/api/comment/${commentId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!error) {
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return {
    comments,
    isLoading,
    error,
    addComment,
    deleteComment,
    fetchComments,
  };
}
