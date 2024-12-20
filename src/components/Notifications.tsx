"use client";

import { getTimeAgo } from "@/utils/helpers";
import { useNotificationContext } from "@/contexts/NotificationContext";
import useUser from "@/hooks/useUser";
import Image from "next/image";
import closeIcon from "@/assets/close-icon.svg";
import ProfileBadge from "./ProfileBadge";

export default function Notifications() {
  const { notifications, isLoading, markAsRead, deleteNotification } =
    useNotificationContext();

  return (
    <div
      className="p-6 h-full overflow-y-auto [&::-webkit-scrollbar]:w-2
         [&::-webkit-scrollbar-track]:rounded-full
         [&::-webkit-scrollbar-track]:bg-gray-100
         [&::-webkit-scrollbar-thumb]:rounded-full
         [&::-webkit-scrollbar-thumb]:bg-gray-300
         dark:[&::-webkit-scrollbar-track]:bg-neutral-700
         dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        {notifications.length > 0 && (
          <button
            className="text-sm text-primaryColor hover:text-cyan-500"
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
              className={`relative p-5 rounded-lg border ${
                notification.is_read
                  ? "bg-secondary border-borderColor"
                  : "bg-bgColorSecondary dark:bg-zinc-800 border-borderColor dark:border-zinc-700"
              }`}
            >
              <button
                onClick={() => deleteNotification(notification._id)}
                className="absolute top-1 right-1 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                <Image src={closeIcon} alt="close" width={16} height={16} />
              </button>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[14px]">
                  <ProfileBadge src={notification.avatar} maxWidth={44} />
                  <div>
                    <p className="pr-8 text-sm">
                      <span className="font-semibold">{notification.content.username}</span>{" "}
                      {notification.content.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getTimeAgo(notification.created_at)}
                    </p>
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="text-xs text-primaryColor hover:text-blue-500 mt-1"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
                {notification.postImg && (
                  <div className="w-[44px] h-[44px] flex-shrink-0">
                    <Image
                      src={notification.postImg}
                      alt="post icon"
                      width={44}
                      height={44}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
