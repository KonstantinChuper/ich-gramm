import { useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface FetchOptions extends Omit<RequestInit, "url"> {
  endpoint: string;
  baseURL?: string;
}

export const useFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async <T,>(options: FetchOptions): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const baseURL = options.baseURL || BASE_URL;
      const url = `${baseURL}${options.endpoint}`;

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Произошла ошибка";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchData, isLoading, error };
};
