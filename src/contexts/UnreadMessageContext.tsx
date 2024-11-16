"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import useUser from "@/hooks/useUser";

interface UnreadMessagesContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  addUnreadMessage: (userId: string) => void;
  clearUnreadMessages: (userId: string) => void;
  unreadByUser: Record<string, number>;
}

const UnreadMessagesContext = createContext<UnreadMessagesContextType | undefined>(undefined);

export function UnreadMessagesProvider({ children }: { children: React.ReactNode }) {
  const [unreadByUser, setUnreadByUser] = useState<Record<string, number>>(() => {
    // Загружаем состояние из localStorage при инициализации
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("unreadMessages");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const { user: currentUser } = useUser();

  useEffect(() => {
    localStorage.setItem("unreadMessages", JSON.stringify(unreadByUser));
  }, [unreadByUser]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !currentUser?._id) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      auth: { token },
    });

    socket.on("receiveMessage", (newMessage: any) => {
      if (newMessage.sender_id !== currentUser._id) {
        setUnreadByUser((prev) => ({
          ...prev,
          [newMessage.sender_id]: (prev[newMessage.sender_id] || 0) + 1,
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser?._id]);

  const addUnreadMessage = (userId: string) => {
    setUnreadByUser((prev) => ({
      ...prev,
      [userId]: (prev[userId] || 0) + 1,
    }));
  };

  const clearUnreadMessages = (userId: string) => {
    setUnreadByUser((prev) => ({
      ...prev,
      [userId]: 0,
    }));
  };

  const unreadCount = Object.values(unreadByUser).reduce((a, b) => a + b, 0);

  return (
    <UnreadMessagesContext.Provider
      value={{
        unreadCount,
        setUnreadCount: () => {},
        addUnreadMessage,
        clearUnreadMessages,
        unreadByUser,
      }}
    >
      {children}
    </UnreadMessagesContext.Provider>
  );
}

export const useUnreadMessages = () => {
  const context = useContext(UnreadMessagesContext);
  if (!context) {
    throw new Error("useUnreadMessages must be used within UnreadMessagesProvider");
  }
  return context;
};
