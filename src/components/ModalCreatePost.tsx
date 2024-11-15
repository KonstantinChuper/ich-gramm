"use client";

import { useRef, useState, DragEvent } from "react";
import { useAxios } from "@/hooks/useAxios";
import Image from "next/image";
import useUser from "@/hooks/useUser";
import ProfileBadge from "./ProfileBadge";
import WordCounter from "./WordCounter";
import EmojiPicker from "./EmojiPicker";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { user, isLoading } = useUser();
  const { request } = useAxios();
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxWords = 400;

  if (!isOpen) return null;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxWords) {
      setPostText(value);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setPostText((prevText) => prevText + emoji);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("Please add an image");
      return;
    }

    const formData = new FormData();
    formData.append("caption", postText);
    formData.append("image", selectedImage, selectedImage.name);

    const { error } = await request({
      endpoint: "/api/post",
      method: "POST",
      data: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (error) {
      console.error("Error creating post:", error);
      alert("Error creating post");
      return;
    }

    setPostText("");
    setSelectedImage(null);
    window.dispatchEvent(new CustomEvent("postCreated"));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-20 ml-[245px] flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-70" onClick={onClose} />

      <div className="bg-secondary rounded-xl w-full max-w-[913px] max-h-[913px] relative z-50 mx-5">
        <div className="border-b border-borderColor p-3 text-center relative">
          <h2 className="font-semibold">Create new post</h2>
          <button
            onClick={handleSubmit}
            disabled={isLoading || (!postText.trim() && !selectedImage)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primaryColor font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>

        <div className="flex">
          <div
            className={`bg-bgColorLight w-full flex-1 rounded-bl-xl ${
              isDragging
                ? "border-2 border-dashed border-borderColor"
                : "border-r border-borderColor"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center min-h-[500px] py-2">
              {selectedImage ? (
                <div className="relative w-full h-full min-h-[500px]">
                  <Image
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    fill
                    className="object-contain"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 rounded-full bg-white p-2 hover:scale-110 transition-all duration-300"
                  >
                    <Image
                      src="/icons/remove-image-photo-icon.svg"
                      alt="Close"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              ) : (
                <>
                  <Image src="/icons/media.svg" alt="Media" width={153} height={153} />
                  <p className="mt-4 text-lg">Drag photos and videos here</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                  <button onClick={handleSelectClick} className="btn btn-primary mt-4 px-5">
                    Select from computer
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col max-w-[340px] flex-1 p-4">
            <div className="flex flex-col gap-3 h-full">
              <div className="flex items-center gap-3">
                <ProfileBadge
                  src={user?.profile_image || "/default-profile-image.svg"}
                  maxWidth={26}
                />
                <p>{user?.username}</p>
              </div>
              <textarea
                name="caption"
                value={postText}
                onChange={handleTextChange}
                placeholder="Write a caption..."
                maxLength={maxWords}
                className="mt-[7px] p-3 pb-6 border border-borderColor w-full h-full rounded-xl focus:outline-none focus:bg-bgColorLight !ring-textGrayColor focus:!ring-textGrayColor focus:!border-textGrayColor resize-none flex-1 bg-inputColor"
              />
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              <WordCounter
                currentLength={postText.length}
                maxLength={maxWords}
                className="bottom-6 right-7"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
