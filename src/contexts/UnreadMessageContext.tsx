"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import useUser from "@/hooks/useUser";
import { LastMessage } from "@/services/socketManager";

interface UnreadMessage {
  count: number;
  lastReceived: string;
}

interface UnreadMessagesContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  addUnreadMessage: (userId: string) => void;
  clearUnreadMessages: (userId: string) => void;
  unreadByUser: Record<string, UnreadMessage>;
  lastMessages: Record<string, LastMessage>;
  setLastMessage: (userId: string, message: LastMessage) => void;
  getLastMessage: (userId: string) => LastMessage | undefined;
}

const UnreadMessagesContext = createContext<UnreadMessagesContextType | undefined>(undefined);

export function UnreadMessagesProvider({ children }: { children: React.ReactNode }) {
  const [unreadByUser, setUnreadByUser] = useState<Record<string, UnreadMessage>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("unreadMessages");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [lastMessages, setLastMessages] = useState<Record<string, LastMessage>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lastMessages");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const { user: currentUser } = useUser();

  // Сохраняем состояние в localStorage при изменении
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("unreadMessages", JSON.stringify(unreadByUser));
      console.log("Saved unreadMessages:", unreadByUser);
    }
  }, [unreadByUser]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lastMessages", JSON.stringify(lastMessages));
      console.log("Saved lastMessages:", lastMessages);
    }
  }, [lastMessages]);

  // Подключение к сокету и обработка сообщений
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !currentUser?._id) return;

    console.log("Connecting socket for user:", currentUser._id);

    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    socket.on("receiveMessage", (newMessage: LastMessage) => {
      console.log("Received new message:", newMessage);

      const senderId = newMessage.sender_id;
      const receiverId = newMessage.receiver_id;
      const messageTime = newMessage.created_at || new Date().toISOString();

      // Если мы получатель
      if (receiverId === currentUser._id) {
        console.log("Updating unread messages for sender:", senderId);

        setUnreadByUser((prev) => ({
          ...prev,
          [senderId]: {
            count: (prev[senderId]?.count || 0) + 1,
            lastReceived: messageTime,
          },
        }));

        setLastMessages((prev) => ({
          ...prev,
          [senderId]: newMessage,
        }));
      }

      // Если мы отправитель
      if (senderId === currentUser._id) {
        console.log("Updating last message for receiver:", receiverId);

        setLastMessages((prev) => ({
          ...prev,
          [receiverId]: newMessage,
        }));
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      console.log("Disconnecting socket");
      socket.disconnect();
    };
  }, [currentUser?._id]);

  const addUnreadMessage = (userId: string) => {
    console.log("Adding unread message for user:", userId);

    const messageTime = new Date().toISOString();
    setUnreadByUser((prev) => ({
      ...prev,
      [userId]: {
        count: (prev[userId]?.count || 0) + 1,
        lastReceived: messageTime,
      },
    }));
  };

  const clearUnreadMessages = (userId: string) => {
    console.log("Clearing unread messages for user:", userId);

    setUnreadByUser((prev) => ({
      ...prev,
      [userId]: {
        count: 0,
        lastReceived: prev[userId]?.lastReceived || new Date().toISOString(),
      },
    }));
  };

  const setLastMessage = (userId: string, message: LastMessage) => {
    console.log("Setting last message for user:", userId, message);

    setLastMessages((prev) => ({
      ...prev,
      [userId]: message,
    }));
  };

  const getLastMessage = (userId: string): LastMessage | undefined => {
    return lastMessages[userId];
  };

  // Подсчет общего количества непрочитанных сообщений
  const unreadCount = Object.values(unreadByUser).reduce((total, user) => {
    return total + (user?.count || 0);
  }, 0);

  console.log("Current unread count:", unreadCount);

  return (
    <UnreadMessagesContext.Provider
      value={{
        unreadCount,
        setUnreadCount: () => {}, // Этот метод можно удалить, если он не используется
        addUnreadMessage,
        clearUnreadMessages,
        unreadByUser,
        lastMessages,
        setLastMessage,
        getLastMessage,
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
