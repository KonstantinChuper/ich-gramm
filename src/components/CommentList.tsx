"use client";

import ProfileBadge from "./ProfileBadge";
import { getTimeAgo } from "@/utils/helpers";
import useComments from "@/hooks/useComments";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface CommentListProps {
  postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
  const { comments, error, fetchComments } = useComments({ postId });
  const router = useRouter();

  useEffect(() => {
    const handleCommentsUpdate = (event: CustomEvent) => {
      if (event.detail.postId === postId) {
        fetchComments();
      }
    };

    window.addEventListener("commentsUpdated", handleCommentsUpdate as EventListener);

    return () => {
      window.removeEventListener("commentsUpdated", handleCommentsUpdate as EventListener);
    };
  }, [postId, fetchComments]);

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  if (error)
    return (
      <div className="text-center text-sm text-textGrayColor">Error loading comments: {error}</div>
    );

  return (
    <div className="space-y-4">
      {comments.length === 0 && (
        <div className="text-center text-sm text-textGrayColor">No comments yet</div>
      )}
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <div onClick={() => handleUserClick(comment.user_id)} className="cursor-pointer">
            <ProfileBadge src={comment.user.avatar_url} maxWidth={32} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-semibold mr-2">{comment.user.username}</span>
            <span className="break-all whitespace-pre-line">{comment.comment_text}</span>
            <p className="text-xs text-textGrayColor pt-1">{getTimeAgo(comment.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
