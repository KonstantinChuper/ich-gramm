"use client";

import { useEffect, useRef, useState } from "react";
import { emojis } from "@/data/emojis";
import Image from "next/image";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
        type="button"
      >
        <Image
          src="/icons/emoji.svg"
          alt="emoji"
          width={20}
          height={20}
          className="min-w-[20px] min-h-[20px]"
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 min-w-[270px] w-full mb-2 bg-primary border rounded-lg shadow-lg p-2 z-10">
          <div
            className="grid grid-cols-7 gap-2 max-h-[200px] overflow-y-auto [&::-webkit-scrollbar]:w-2
               [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100
               [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300
               dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
          >
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  onEmojiSelect(emoji.char);
                  setIsOpen(false);
                }}
                className="text-base hover:bg-gray-100 p-1 rounded"
                title={emoji.name}
              >
                {emoji.char}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
