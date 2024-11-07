"use client";

import React from "react";
import Image from "next/image";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 ml-[245px] flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-70" onClick={onClose} />

      <div className="bg-white rounded-xl w-full max-w-[913px] max-h-[913px] relative z-50 mx-4">
        <div className="border-b border-borderColor p-4 text-center relative">
          <h2 className="font-semibold">Create new post</h2>
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2">
            <Image src="/icons/close.svg" alt="Close" width={24} height={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Image src="/icons/media.svg" alt="Media" width={96} height={96} />
            <p className="mt-4 text-xl">Drag photos and videos here</p>
            <button className="btn btn-primary mt-4">Select from computer</button>
          </div>
        </div>
      </div>
    </div>
  );
}
