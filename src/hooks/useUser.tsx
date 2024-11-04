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
      setIsCurrentUser(!userId); // если userId не передан, значит это текущий пользователь
    }
  }, [fetchData, userId]);

  const updateUser = useCallback(
    async (formDataToSend: FormData) => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await fetchData<Response>({
        endpoint: "/api/user/current",
        method: "PUT",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response) {
        throw new Error("Ошибка при обновлении профиля");
      }

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Ошибка при обновлении профиля");
      }

      return result;
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
