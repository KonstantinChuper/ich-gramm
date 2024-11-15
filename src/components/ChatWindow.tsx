"use client";

import { useState, useRef, useEffect } from "react";
import useMessage from "@/hooks/useMessage";
import useUser from "@/hooks/useUser";
import ProfileBadge from "@/components/ProfileBadge";
import { useAxios } from "@/hooks/useAxios";

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
  const { messages, sendMessage, isLoading } = useMessage(targetUserId);
  const { user: currentUser } = useUser();
  const { request } = useAxios();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    return <div className="h-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-borderColor flex items-center gap-3">
        <ProfileBadge src={targetUser?.profile_image} maxWidth={40} />
        <span className="font-semibold">{targetUser?.username}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.sender_id === currentUser?._id;
          return (
            <div
              key={message._id}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-2xl ${
                  isCurrentUser
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-gray-200 rounded-tl-none"
                }`}
              >
                <p>{message.message_text}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-borderColor">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Напишите сообщение..."
            className="flex-1 p-2 rounded-lg border border-borderColor bg-primary focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}
