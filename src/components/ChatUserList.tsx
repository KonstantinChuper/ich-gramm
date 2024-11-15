"use client";

import { useEffect, useState } from "react";
import { useAxios } from "@/hooks/useAxios";
import ProfileBadge from "@/components/ProfileBadge";
import { User } from "@/types/User";

interface UserListProps {
  onSelectUser: (userId: string) => void;
  selectedUserId: string | null;
}

export default function UserList({ onSelectUser, selectedUserId }: UserListProps) {
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const { request } = useAxios();

  useEffect(() => {
    const recentChats = JSON.parse(localStorage.getItem("recentChats") || "[]");
    setRecentUsers(recentChats);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await request<User[]>({
        endpoint: "/api/user/all",
        method: "GET",
      });
      if (data) {
        const filteredUsers = data.filter(
          (user) => !recentUsers.some((recentUser) => recentUser._id === user._id)
        );
        setAllUsers(filteredUsers);
      }
    };

    fetchUsers();
  }, [recentUsers]);

  return (
    <div className="bg-primary">
      {/* Недавние чаты */}
      {recentUsers.length > 0 && (
        <>
          <div className="px-4 py-2 text-sm text-textGrayColor">Recent chats</div>
          {recentUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => onSelectUser(user._id)}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-hover transition-colors
                ${selectedUserId === user._id ? "bg-bgColorSecondary" : ""}`}
            >
              <ProfileBadge src={user.profile_image} maxWidth={40} />
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-textGrayColor">Recent chat</p>
              </div>
            </div>
          ))}
          <div className="my-2" />
        </>
      )}

      {/* Все пользователи */}
      <div className="px-4 py-2 text-sm text-textGrayColor">All users</div>
      {allUsers.map((user) => (
        <div
          key={user._id}
          onClick={() => {
            onSelectUser(user._id);
            const newRecentUser = {
              _id: user._id,
              username: user.username,
              profile_image: user.profile_image,
            };
            const updatedRecentUsers = [newRecentUser, ...recentUsers].slice(0, 20);
            localStorage.setItem("recentChats", JSON.stringify(updatedRecentUsers));
            setRecentUsers(updatedRecentUsers as User[]);
          }}
          className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-hover transition-colors
            ${selectedUserId === user._id ? "bg-bgColorSecondary" : ""}`}
        >
          <ProfileBadge src={user.profile_image} maxWidth={40} />
          <div>
            <p className="font-semibold">{user.username}</p>
            <p className="text-sm text-textGrayColor">Push to start a chat</p>
          </div>
        </div>
      ))}
    </div>
  );
}
