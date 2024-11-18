"use client";

import { useState, useCallback } from "react";
import { useAxios } from "./useAxios";

interface Notification {
  _id: string;
  user_id: string;
  type: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

type NotificationType = "like" | "comment" | "follow" | "mention";

export default function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { request, isLoading, error } = useAxios();

  const createNotification = useCallback(
    async (user_id: string, type: NotificationType, content: string) => {
      try {
        const { data } = await request({
          endpoint: `/api/notifications/notifications`,
          method: "POST",
          data: {
            user_id,
            type,
            content,
          },
        });

        if (data) {
          await fetchNotifications(user_id);
        }
      } catch (error) {
        console.error("Error creating notification:", error);
      }
    },
    [request]
  );

  const fetchNotifications = useCallback(
    async (user_id: string) => {
      try {
        const { data } = await request<Notification[]>({
          endpoint: `/api/notifications/${user_id}/notifications`,
          method: "GET",
        });

        if (data) {
          setNotifications(data);
          console.log(setNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    },
    [request]
  );

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await request({
          endpoint: `/api/notifications/notifications/${notificationId}`,
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
          endpoint: `/api/notifications/notifications/${notificationId}`,
          method: "DELETE",
        });

        setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    },
    [request]
  );

  return {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    createNotification,
  };
}
