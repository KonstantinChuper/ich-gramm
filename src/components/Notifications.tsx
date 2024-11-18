"use client";

import { useEffect } from "react";
import useNotifications from "@/hooks/useNotifications";
import useUser from "@/hooks/useUser";
import { getTimeAgo } from "@/utils/helpers";
import Image from "next/image";
import closeIcon from "@/assets/close-icon.svg";
import { useNotificationContext } from "@/contexts/NotificationContext";


export default function Notifications() {
  const { user: currentUser } = useUser();
  const { notifications, isLoading, fetchNotifications, markAsRead, deleteNotification } =
    useNotificationContext();

  useEffect(() => {
    if (currentUser?._id) {
      console.log("Fetching notifications for user:", currentUser._id);
      fetchNotifications(currentUser._id);
    }
  }, [currentUser?._id]);

  console.log("Current notifications:", notifications);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        {notifications.length > 0 && (
          <button
            className="text-sm text-blue-500 hover:text-blue-600"
            onClick={() => notifications.forEach((n) => markAsRead(n._id))}
          >
            Mark all as read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <p>Loading...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`relative p-4 rounded-lg border ${
                notification.is_read
                  ? "bg-secondary border-borderColor"
                  : "bg-blue-50 dark:bg-zinc-800 border-blue-100 dark:border-zinc-700"
              }`}
            >
              <button
                onClick={() => deleteNotification(notification._id)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                <Image src={closeIcon} alt="close" width={16} height={16} />
              </button>
              <p className="pr-8">{notification.content}</p>
              <p className="text-xs text-gray-500 mt-2">{getTimeAgo(notification.created_at)}</p>
              {!notification.is_read && (
                <button
                  onClick={() => markAsRead(notification._id)}
                  className="text-xs text-blue-500 hover:text-blue-600 mt-2"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
