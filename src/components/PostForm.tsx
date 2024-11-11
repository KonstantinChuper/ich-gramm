"use client";

import { useState } from "react";
import EmojiPicker from "./EmojiPicker";
import useComments from "@/hooks/useComments";

interface PostFormProps {
  postId: string;
}

export default function PostForm({ postId }: PostFormProps) {
  const [comment, setComment] = useState("");
  const { addComment } = useComments({ postId });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      await addComment(comment.trim());
      setComment("");
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
