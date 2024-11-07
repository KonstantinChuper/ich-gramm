"use client";

import { useState } from "react";
import Image from "next/image";
import useUser from "@/hooks/useUserAxios";
import ProfileBadge from "./ProfileBadge";
import WordCounter from "./WordCounter";
import EmojiPicker from "./EmojiPicker";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { user, userAvatar } = useUser();
  const [postText, setPostText] = useState("");
  const maxWords = 2200;

  if (!isOpen) return null;

  const handleEmojiSelect = (emoji: string) => {
    setPostText((prevText) => prevText + emoji);
  };

  return (
    <div className="fixed inset-0 z-20 ml-[245px] flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-70" onClick={onClose} />

      <div className="bg-white rounded-xl w-full max-w-[913px] max-h-[913px] relative z-50 mx-4">
        <div className="border-b border-borderColor p-3 text-center relative">
          <h2 className="font-semibold">Create new post</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primaryColor font-semibold"
          >
            Share
          </button>
        </div>

        <div className="flex">
          <div className="bg-bgColorLight w-full flex-1 rounded-bl-xl">
            <div className="flex flex-col items-center justify-center min-h-[500px]">
              <Image src="/icons/media.svg" alt="Media" width={153} height={153} />
              <p className="mt-4 text-lg">Drag photos and videos here</p>
              <button className="btn btn-primary mt-4 px-5">Select from computer</button>
            </div>
          </div>

          <div className="flex flex-col max-w-[340px] flex-1 border-l border-borderColor p-4">
            <div className="flex flex-col gap-3 h-full">
              <div className="flex items-center gap-3">
                <ProfileBadge src={userAvatar} maxWidth={26} />
                <p>{user?.username}</p>
              </div>
              <textarea
                name="post_description"
                value={"formData.bio"}
                onChange={() => {}}
                className="mt-[7px] p-3 pb-6 border border-borderColor w-full h-full rounded-xl focus:outline-none focus:bg-bgColorLight resize-none flex-1"
              />
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              <WordCounter currentLength={0} maxLength={maxWords} className="bottom-6 right-7" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
