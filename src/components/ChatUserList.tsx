"use client";

import { useEffect, useState } from "react";
import { useAxios } from "@/hooks/useAxios";
import { User } from "@/types/User";
import { useUnreadMessages } from "@/contexts/UnreadMessageContext";
import ProfileBadge from "@/components/ProfileBadge";
import socketManager from "@/services/socketManager";
import useUser from "@/hooks/useUser";
import { getTimeAgo } from "@/utils/helpers";

interface UserListProps {
  onSelectUser: (userId: string) => void;
  selectedUserId: string | null;
}

export default function UserList({ onSelectUser, selectedUserId }: UserListProps) {
  const [chatUsers, setChatUsers] = useState<User[]>([]);
  const { request } = useAxios();
  const { unreadByUser, clearUnreadMessages, getLastMessage } = useUnreadMessages();
  const { user: currentUser } = useUser();
  const [unreadTimes, setUnreadTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("recentChats") || "[]");
    const filteredUsers = savedUsers.filter((user: User) => user._id !== currentUser?._id);
    setChatUsers(filteredUsers);

    setUnreadTimes((prev) => {
      const times = { ...prev };
      filteredUsers.forEach((user: User) => {
        const lastMessage = getLastMessage(user._id);
        if (lastMessage?.created_at) {
          times[user._id] = lastMessage.created_at;
        } else if (unreadByUser[user._id]?.lastReceived) {
          times[user._id] = unreadByUser[user._id].lastReceived;
        }
      });
      return times;
    });
  }, [currentUser, unreadByUser]);

  useEffect(() => {
    const socket = socketManager.getSocket();

    const handleNewMessage = async (message: any) => {
      const otherUserId =
        message.sender_id === currentUser?._id ? message.receiver_id : message.sender_id;

      if (otherUserId !== currentUser?._id && !chatUsers.some((user) => user._id === otherUserId)) {
        const { data: userData } = await request<User>({
          endpoint: `/api/user/${otherUserId}`,
          method: "GET",
        });

        if (userData) {
          const updatedUsers = [userData, ...chatUsers];
          setChatUsers(updatedUsers);
          localStorage.setItem("recentChats", JSON.stringify(updatedUsers));
        }
      }
    };

    socket?.on("receiveMessage", handleNewMessage);
    return () => {
      socket?.off("receiveMessage", handleNewMessage);
    };
  }, [chatUsers, currentUser]);

  const handleUserSelect = (userId: string) => {
    onSelectUser(userId);
    clearUnreadMessages(userId);
  };

  return (
    <div className="bg-primary">
      {chatUsers.map((user) => (
        <div
          key={user._id}
          onClick={() => handleUserSelect(user._id)}
          className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-hover transition-colors
          ${selectedUserId === user._id ? "bg-bgColorSecondary" : ""}`}
        >
          <div className="relative">
            <ProfileBadge src={user.profile_image} maxWidth={40} />
            {unreadByUser[user._id]?.count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {unreadByUser[user._id]?.count}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold">{user.username}</p>
            <p className="text-sm text-textGrayColor">
              {(() => {
                const lastMessage = getLastMessage(user._id);
                if (lastMessage?.created_at) {
                  return `sent a message ${getTimeAgo(lastMessage.created_at)}`;
                }
                return "Start chatting";
              })()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
