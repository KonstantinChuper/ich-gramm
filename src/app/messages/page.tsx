"use client";

import ProfileBadge from "@/components/ProfileBadge";
import useUser from "@/hooks/useUser";
import { useEffect, useState } from "react";
import ChatUserList from "@/components/ChatUserList";
import ChatWindow from "@/components/ChatWindow";
import { useSearchParams } from "next/navigation";

export default function MessagesPage() {
  const { user } = useUser();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const userId = searchParams.get("userId");
    if (userId) {
      setSelectedUserId(userId);
    } else {
      const recentChats = JSON.parse(localStorage.getItem("recentChats") || "[]");
      if (recentChats.length > 0) {
        setSelectedUserId(recentChats[0]._id);
      }
    }
  }, [searchParams]);

  return (
    <div className="ml-[245px] flex h-full bg-primary">
      <div className="max-w-[350px] border-r border-borderColor bg-primary flex-1">
        <div className="flex items-center gap-4 p-6">
          <ProfileBadge src={user?.profile_image} maxWidth={50} />
          <p className="font-semibold">{user?.username}</p>
        </div>
        <ChatUserList onSelectUser={setSelectedUserId} selectedUserId={selectedUserId} />
      </div>

      <div className="flex-1 bg-primary">
        {selectedUserId ? (
          <ChatWindow targetUserId={selectedUserId} />
        ) : (
          <div className="h-full flex items-center justify-center text-textGrayColor">
            Choose a user to start a conversation
          </div>
        )}
      </div>
    </div>
  );
}
