import { useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface FetchOptions extends Omit<RequestInit, "url"> {
  endpoint: string;
  baseURL?: string;
}

export const useFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async <T,>(options: FetchOptions, isMultipart?: boolean): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const baseURL = options.baseURL || BASE_URL;
      const url = `${baseURL}${options.endpoint}`;

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": isMultipart ? "application/json" : "",
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // throw new Error(`HTTP error! status: ${response.status}`);
        setError(data.message || "Произошла ошибка");
        return null;
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Произошла ошибка";
      console.error(errorMessage);
      setError("Произошла ошибка при подключении к серверу");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchData, isLoading, error };
};
