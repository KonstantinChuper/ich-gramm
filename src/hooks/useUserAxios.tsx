"use client";

import { useState, useEffect, useCallback } from "react";
import { useAxios } from "./useAxios";
import { isTokenExpired } from "@/utils/tokenUtils";
import { useRouter } from "next/navigation";
import { parseImage } from "@/utils/helpers";
import { User } from "@/types/User";

interface UserResponse {
  user: User;
}

export default function useUser(userId?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(true);
  const [userAvatar, setUserAvatar] = useState("/default-profile-image.svg");
  const { request, isLoading, error } = useAxios();
  const router = useRouter();

  const checkAndGetToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      router.push("/login");
      return null;
    }

    return token;
  };

  const fetchUser = useCallback(async () => {
    const token = checkAndGetToken();
    if (!token) return;

    const endpoint = userId ? `/api/user/${userId}` : "/api/user/current";

    try {
      const { data, error } = await request<UserResponse | User>({
        // Изменили тип
        endpoint,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (error) {
        throw new Error(error);
      }

      if (!data) return;

      // Проверяем формат данных и извлекаем пользователя
      const userData = "user" in data ? data.user : data;

      if (userData && "_id" in userData) {
        setUser(userData);
        setIsCurrentUser(!userId);
      } else {
        console.error("Invalid user data format:", data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      if (error === "Unauthorized") {
        router.push("/login");
      }
    }
  }, [request, userId, router]);

  const updateUser = useCallback(
    async (formDataToSend: FormData) => {
      const token = checkAndGetToken();
      if (!token) return false;

      try {
        const { data, error } = await request<UserResponse>({
          endpoint: "/api/user/current",
          method: "PUT",
          data: formDataToSend,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (error) {
          console.error("Update error:", error);
          return false;
        }

        if (data?.user) {
          setUser(data.user);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Update error:", error);
        return false;
      }
    },
    [request]
  );

  useEffect(() => {
    fetchUser();
  }, [userId]);

  // const userAvatar = parseImage(user?.profile_image || "/default-profile-image.svg");

  useEffect(() => {
    if (user?.profile_image) {
      setUserAvatar(parseImage(user.profile_image));
    }
  }, [user?.profile_image]);

  return {
    user,
    isLoading,
    error,
    isCurrentUser,
    fetchUser,
    updateUser,
    userAvatar,
  };
}
