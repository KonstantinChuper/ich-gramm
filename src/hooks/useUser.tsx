"use client";

import { useState, useEffect, useCallback } from "react";
import { useFetch } from "./useFetch";
import { isTokenExpired } from "@/utils/tokenUtils";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  username: string;
  email: string;
  full_name: string;
  bio: string;
  profile_image: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: string;
  has_stories: boolean;
}

export default function useUser(userId?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(true);
  const { fetchData, isLoading, error } = useFetch();
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }
    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    const endpoint = userId ? `/api/user/${userId}` : "/api/user/current";

    const response = await fetchData<{ user: User }>({
      endpoint,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.user) {
      setUser(response.user);
      setIsCurrentUser(!userId);
    }
  }, [fetchData, userId]);

  const updateUser = useCallback(
    async (data: any, isMultipart = false) => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      await fetchData({
        endpoint: "/api/user/current",
        method: "PUT",
        body: data,
        isMultipart,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchUser();
    },
    [fetchUser]
  );

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    isLoading,
    error,
    isCurrentUser,
    fetchUser,
    updateUser,
  };
}
