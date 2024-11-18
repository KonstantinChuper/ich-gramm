"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { useAxios } from "@/hooks/useAxios";
import useUser from "@/hooks/useUser";
import { useSocket } from "./SocketContext";

interface Notification {
  _id: string;
  user_id: string;
  type: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationContextType {
  notifications: Notification[];
  isLoading: boolean;
  error: any;
  unreadCount: number;
  fetchNotifications: (user_id: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  createNotification: (user_id: string, type: string, content: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { request, isLoading, error } = useAxios();
  const { user: currentUser } = useUser();
  const { socket } = useSocket();

  useEffect(() => {
    if (!currentUser?._id || !socket) return;

    // Подписываемся на уведомления
    socket.emit("joinNotifications", currentUser._id);

    // Слушаем новые уведомления
    socket.on("newNotification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.emit("leaveNotifications", currentUser._id);
      socket.off("newNotification");
    };
  }, [currentUser?._id, socket]);

  const fetchNotifications = useCallback(
    async (user_id: string) => {
      try {
        const { data } = await request<Notification[]>({
          endpoint: `/api/notifications/${user_id}/notifications`,
          method: "GET",
        });

        if (data) {
          setNotifications(data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    },
    [request]
  );

  const createNotification = useCallback(
    async (user_id: string, type: string, content: string) => {
      try {
        const { data } = await request({
          endpoint: `/api/notifications`,
          method: "POST",
          data: {
            user_id,
            type,
            content,
          },
        });

        if (data) {
          if (currentUser?._id === user_id) {
            setNotifications((prev) => [...prev, data as Notification]);
          }
          fetchNotifications(user_id);
        }
      } catch (error) {
        console.error("Error creating notification:", error);
      }
    },
    [request, currentUser?._id]
  );

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await request({
          endpoint: `/api/notifications/${notificationId}`,
          method: "PATCH",
          data: { is_read: true },
        });

        setNotifications((prev) =>
          prev.map((notif) => (notif._id === notificationId ? { ...notif, is_read: true } : notif))
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [request]
  );

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        await request({
          endpoint: `/api/notifications/${notificationId}`,
          method: "DELETE",
          data: {},
          headers: {
            "Content-Type": "application/json",
          },
        });

        setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    },
    [request]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        isLoading,
        error,
        unreadCount,
        fetchNotifications,
        markAsRead,
        deleteNotification,
        createNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotificationContext must be used within a NotificationProvider");
  }
  return context;
};
