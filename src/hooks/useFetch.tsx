import { useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface FetchOptions extends Omit<RequestInit, "url"> {
  endpoint: string;
  baseURL?: string;
  isMultipart?: boolean;
}

export const useFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async <T,>(options: FetchOptions): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("OPtions!!!!!!", options)
      const baseURL = options.baseURL || BASE_URL;
      const url = `${baseURL}${options.endpoint}`;

      let fetchOptions: RequestInit = { ...options };

      if (options.isMultipart) {
        const formData = new FormData();
        if (options.body && typeof options.body === "object") {
          Object.entries(options.body as Record<string, any>).forEach(([key, value]) => {
            formData.append(key, value);
          });
        }

        fetchOptions = {
          ...options,
          method: options.method || "POST",
          body: formData,
          headers: { ...options.headers },
        };
      } else {
        fetchOptions = {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          body: JSON.stringify(options.body)
        };
      }

      const response = await fetch(url, fetchOptions);
      const data = await response.json();

      if (!response.ok) {
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
