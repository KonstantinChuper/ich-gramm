"use client";

import { useState } from "react";
import { useNotificationContext } from "@/contexts/NotificationContext";
import useComments from "@/hooks/useComments";
import EmojiPicker from "./EmojiPicker";
import useUser from "@/hooks/useUser";
import usePost from "@/hooks/usePost";

interface PostFormProps {
  postId: string;
}

export default function PostForm({ postId }: PostFormProps) {
  const [comment, setComment] = useState("");
  const { addComment, fetchComments } = useComments({ postId });
  const { createNotification } = useNotificationContext();
  const { user: currentUser } = useUser();
  const { fetchPostById } = usePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim() || !currentUser) return;

    try {
      const postData = await fetchPostById(postId);
      if (!postData) {
        console.error("Could not fetch post data");
        return;
      }

      const postOwnerId = postData.user_id?._id;

      if (!postOwnerId) {
        console.error("Could not get post owner ID", postData);
        return;
      }

      await addComment(comment.trim());

      if (postOwnerId !== currentUser._id) {
        await createNotification(
          postOwnerId,
          "comment",
          {
            username: currentUser.username,
            message: "commented on your post",
          },
          currentUser.profile_image || "",
          postData.image_url || ""
        );
      }

      await fetchComments();
      setComment("");

      window.dispatchEvent(
        new CustomEvent("commentsUpdated", {
          detail: { postId },
        })
      );
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setComment((prev) => prev + emoji);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-borderColor py-3 pl-4 pr-4"
    >
      <EmojiPicker onEmojiSelect={handleEmojiSelect} />
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment"
        className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 p-0"
        maxLength={2200}
      />
      <button
        type="submit"
        disabled={!comment.trim()}
        className="text-primaryColor font-semibold disabled:opacity-50 mr-2"
      >
        Send
      </button>
    </form>
  );
}
