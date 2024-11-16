import React, { useEffect, useState } from "react";
import closeIcon from "@/assets/close-icon.svg";
import Image from "next/image";
import { useAxios } from "@/hooks/useAxios";
import { User } from "@/types/User";
import ProfileBadge from "./ProfileBadge";
import Link from "next/link";

interface SearchBarInputProps {
  mt: string;
  onClose?: () => void;
}

export default function SearchBarInput({ mt, onClose }: SearchBarInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [recentSearches, setRecentSearches] = useState<User[]>([]);
  const { request } = useAxios();

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.trim()) {
      setIsLoading(true);
      try {
        const { data } = await request<User[]>({
          endpoint: `/api/search/users?query=${encodeURIComponent(value)}`,
          method: "GET",
        });

        if (data) {
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleClearInput = () => {
    setInputValue("");
    setSearchResults([]);
  };

  const handleUserClick = (user: User) => {
    onClose?.();
    setInputValue("");
    addToRecentSearches(user);
    setSearchResults([]);
  };

  const addToRecentSearches = (user: User) => {
    const updatedRecent = [user, ...recentSearches.filter((u) => u._id !== user._id)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));
  };

  const removeFromRecentSearches = (userId: string) => {
    const updatedRecent = recentSearches.filter((user) => user._id !== userId);
    setRecentSearches(updatedRecent);
    localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <div>
      <div className="w-full relative" style={{ marginTop: mt }}>
        <input
          type="text"
          placeholder="Search"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full bg-inputColor text-base font-light text-textGrayColor pl-4 pr-8 py-[10px] rounded-lg !border-0 !ring-0 !outline-none focus:!outline-none focus:!ring-2 focus:!ring-zinc-500 dark:!bg-inputColor"
        />
        <div className="absolute right-3 top-[12px] flex items-center gap-2">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-primaryColor border-t-transparent rounded-full animate-spin" />
          )}
          {inputValue && (
            <button onClick={handleClearInput}>
              <Image src={closeIcon} alt="close icon" />
            </button>
          )}
        </div>
      </div>

      {/* Результаты поиска */}
      {searchResults.length > 0 && (
        <div className="mt-4 space-y-4">
          {searchResults.map((user) => (
            <Link
              href={`/profile/${user._id}`}
              key={user._id}
              className="flex items-center gap-3 p-2 hover:bg-hover rounded-lg transition-colors"
              onClick={() => handleUserClick(user)}
            >
              <ProfileBadge
                src={user.profile_image || "/default-profile-image.svg"}
                maxWidth={44}
              />
              <div>
                <p className="font-semibold">{user.username}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Недавние поиски */}
      {!searchResults.length && recentSearches.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <p className="text-base font-semibold">Recent</p>
            <button
              onClick={clearAllRecentSearches}
              className="text-sm text-primaryColor hover:opacity-80"
            >
              Clear all
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {recentSearches.map((user) => (
              <div key={user._id} className="flex items-center justify-between p-2">
                <Link
                  href={`/profile/${user._id}`}
                  className="flex items-center gap-3"
                  onClick={() => onClose?.()}
                >
                  <ProfileBadge
                    src={user.profile_image || "/default-profile-image.svg"}
                    maxWidth={44}
                  />
                  <p className="font-semibold">{user.username}</p>
                </Link>
                <button
                  onClick={() => removeFromRecentSearches(user._id)}
                  className="text-sm text-textGrayColor hover:text-primaryColor"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
