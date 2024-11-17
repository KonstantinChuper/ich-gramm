"use client";

import { useState, useRef, useEffect } from "react";
import useMessage from "@/hooks/useMessage";
import useUser from "@/hooks/useUser";
import ProfileBadge from "@/components/ProfileBadge";
import { useAxios } from "@/hooks/useAxios";
import Spiner from "./Spiner";
import socketManager from "@/services/socketManager";

interface ChatWindowProps {
  targetUserId: string;
}

interface TargetUser {
  _id: string;
  username: string;
  profile_image?: string;
}

export default function ChatWindow({ targetUserId }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState<TargetUser | null>(null);
  const { messages, sendMessage, isLoading, error, isConnected } = useMessage(targetUserId);
  const { user: currentUser } = useUser();
  const { request } = useAxios();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketManager.clearUnreadMessages(targetUserId);
  }, [targetUserId]);

  useEffect(() => {
    const fetchTargetUser = async () => {
      const { data } = await request<TargetUser>({
        endpoint: `/api/user/${targetUserId}`,
        method: "GET",
      });
      if (data) {
        setTargetUser(data);
      }
    };

    fetchTargetUser();
  }, [targetUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  if (isLoading) {
    return <Spiner />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!isConnected) {
    return <div className="text-yellow-500 text-center p-4">Переподключение...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-borderColor flex items-center gap-3">
        <ProfileBadge src={targetUser?.profile_image} maxWidth={40} />
        <span className="font-semibold">{targetUser?.username}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.sender_id === currentUser?._id;
          return (
            <div
              key={message._id}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] py-4 px-5 rounded-2xl ${
                  isCurrentUser
                    ? "bg-[#4D00FF] text-white rounded-tr-none"
                    : "bg-bgColorSecondary rounded-tl-none"
                }`}
              >
                <p>{message.message_text}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-borderColor">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Write a message..."
            className="flex-1 p-2 rounded-2xl border border-borderColor bg-inputColor !ring-0 !outline-none focus:!border-none focus:!outline-none focus:!ring-2 focus:!ring-zinc-500 dark:!bg-inputColor"
          />
          <button
            onClick={handleSend}
            className="px-10 py-2 bg-primaryColor text-white rounded-2xl hover:opacity-80 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
