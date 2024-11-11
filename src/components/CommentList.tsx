"use client";

import ProfileBadge from "./ProfileBadge";
import { getTimeAgo } from "@/utils/helpers";
import useComments from "@/hooks/useComments";

interface CommentListProps {
  postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
  const { comments, error } = useComments({ postId });

  if (error) return <div className="text-center text-sm text-textGrayColor">Error loading comments: {error}</div>;

  return (
    <div className="space-y-4">
      {(comments.length === 0) && <div className="text-center text-sm text-textGrayColor">No comments yet</div>}
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <ProfileBadge src={comment.user.avatar_url} maxWidth={32} />
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
