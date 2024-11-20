"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { useAxios } from "@/hooks/useAxios";
import useUser from "@/hooks/useUser";
import { useSocket } from "./SocketContext";

interface Notification {
  _id: string;
  user_id: string;
  type: string;
  content: {
    username: string;
    message: string;
  };
  avatar: string;
  postImg?: string;
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
  createNotification: (
    user_id: string,
    type: string,
    content: {
      username: string;
      message: string;
    },
    avatar: string,
    postImg?: string
  ) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { request, isLoading, error } = useAxios();
  const { user: currentUser } = useUser();
  const { socket } = useSocket();

  useEffect(() => {
    const count = notifications.filter((n) => !n.is_read).length;
    setUnreadCount(count);
  }, [notifications]);

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
          const unreadCount = data.filter((n) => !n.is_read).length;
          setUnreadCount(unreadCount);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    },
    [request]
  );

  const createNotification = useCallback(
    async (
      user_id: string,
      type: string,
      content: { username: string; message: string },
      avatar: string,
      postImg?: string
    ) => {
      if (user_id === currentUser?._id) {
        return;
      }

      try {
        await request({
          endpoint: `/api/notifications`,
          method: "POST",
          data: {
            user_id,
            sender_id: currentUser?._id,
            type,
            content: {
              username: content.username,
              message: content.message,
            },
            avatar,
            postImg: postImg || null,
          },
        });
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

  useEffect(() => {
    if (currentUser?._id) {
      console.log("Fetching notifications for user:", currentUser._id);
      fetchNotifications(currentUser._id);
    }
  }, [currentUser?._id]);

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
