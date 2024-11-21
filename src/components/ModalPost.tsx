"use client";

import { useEffect, useState } from "react";
import { getTimeAgo } from "@/utils/helpers";
import { useAxios } from "@/hooks/useAxios";
import { useRouter } from "next/navigation";
import { Post } from "@/types/Post";
import ProfileBadge from "./ProfileBadge";
import CommentList from "./CommentList";
import LikeCounter from "./LikeCounter";
import PostForm from "./PostForm";
import menuBtn from "@/assets/Menu-buttons.svg";
import useUser from "@/hooks/useUser";
import usePost from "@/hooks/usePost";
import Image from "next/image";

interface ModalPostProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

interface PostAuthor {
  username: string;
  profile_image?: string;
}

export default function ModalPost({ post, isOpen, onClose }: ModalPostProps) {
  const [postAuthor, setPostAuthor] = useState<PostAuthor | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const { user: currentUser } = useUser();
  const { deletePost } = usePost();
  const { request } = useAxios();
  const router = useRouter();

  useEffect(() => {
    const fetchPostAuthor = async () => {
      const { data } = await request<PostAuthor>({
        endpoint: `/api/user/${post.user_id}`,
        method: "GET",
      });
      if (data) {
        setPostAuthor(data);
      }
    };

    fetchPostAuthor();
  }, [post.user_id]);

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/profile/${post.user_id}`);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(true);
  };

  const handleDelete = async () => {
    try {
      const payload = { postId: post._id };
      const success = await deletePost(post._id, payload);
      if (success) {
        window.location.reload();
        onClose();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
    setShowMenu(false);
  };

  const handleEdit = () => {
    setShowMenu(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
    setShowMenu(false);
  };

  const handleGoToPost = () => {
    router.push(`/post/${post._id}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 aside-margin flex md:items-center md:justify-center items-end">
      <div className="fixed inset-0 md:bg-black bg-opacity-70" onClick={onClose} />

      {/* Modal window */}
      <div className="bg-secondary rounded-md w-full relative max-h-[650px] max-w-[1000px] z-50 mx-4 flex md:flex-row flex-col">
        {/* Left side - image */}
        <div className="flex-1 relative min-h-[650px] max-h-[650px] max-w-[577px] bg-secondary rounded-md hidden md:block">
          <Image
            src={post.image_url}
            alt={post.caption || "Post image"}
            fill
            className="object-scale-down rounded-l-xl"
          />
        </div>

        {/* Right side - post information */}
        <div className="flex flex-col border-l border-borderColor md:min-h-[600px] md:max-w-[433px] max-w-full flex-shrink-0 flex-1 bg-secondary rounded-md">
          <div className="bg-secondary p-4 border-b border-borderColor flex justify-between rounded-md">
            <div
              onClick={handleUserClick}
              className="bg-secondary flex items-center gap-3 cursor-pointer"
            >
              <ProfileBadge
                src={postAuthor?.profile_image || "/default-profile-image.svg"}
                maxWidth={32}
              />
              <span className="font-semibold">{postAuthor?.username}</span>
            </div>
            <div className="relative">
              <button
                onClick={handleMenuClick}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors p-1"
              >
                <Image src={menuBtn} alt="menu" width={24} height={24} className="rounded-full" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 bg-black/70 z-[100] w-full h-full"
                    onClick={() => setShowMenu(false)}
                  />
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary rounded-lg shadow-lg border border-borderColor z-[110] w-[400px] md:ml-[145px]"
                    style={{ position: "fixed" }}
                  >
                    {currentUser?._id === post.user_id ? (
                      <>
                        <button
                          onClick={handleDelete}
                          className="w-full p-3 text-red-500 font-semibold border-b border-borderColor hover:bg-gray-50 dark:hover:bg-zinc-700"
                        >
                          Delete
                        </button>
                        <button
                          onClick={handleEdit}
                          className="w-full p-3 border-b border-borderColor hover:bg-gray-50 dark:hover:bg-zinc-700"
                        >
                          Edit
                        </button>
                      </>
                    ) : null}
                    <button
                      onClick={handleGoToPost}
                      className="w-full p-3 border-b border-borderColor hover:bg-gray-50 dark:hover:bg-zinc-700"
                    >
                      Go to post
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="w-full p-3 border-b border-borderColor hover:bg-gray-50 dark:hover:bg-zinc-700"
                    >
                      Copy link
                    </button>
                    <button
                      onClick={() => setShowMenu(false)}
                      className="w-full p-3 hover:bg-gray-50 dark:hover:bg-zinc-700"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {post.caption && (
            <div className="bg-secondary p-5">
              <div className="bg-secondary flex gap-3">
                <ProfileBadge
                  src={postAuthor?.profile_image || "/default-profile-image.svg"}
                  maxWidth={32}
                />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold mr-2 text-base">{postAuthor?.username}</span>
                  <span className="break-all whitespace-pre-line font-normal text-sm">
                    {post.caption}
                  </span>
                  <p className="text-xs text-textGrayColor pt-1">{getTimeAgo(post.created_at)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="px-5 pb-5 pt-2 border-borderColor flex-1 overflow-y-auto">
            <CommentList postId={post._id} onClose={onClose} />
          </div>

          <div className="ml-[14px] pb-3">
            <LikeCounter postId={post._id} />
            <p className="text-[10px] text-textGrayColor mt-2">{getTimeAgo(post.created_at)}</p>
          </div>

          <div className="flex-0 relative z-50">
            <PostForm postId={post._id} />
          </div>
        </div>
      </div>
    </div>
  );
}
