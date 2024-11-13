"use client";

import axios, { AxiosRequestConfig } from "axios";
import { useState } from "react";

interface RequestOptions extends AxiosRequestConfig {
  endpoint: string;
}

interface AxiosResponse<T> {
  data: T | null;
  error: string | null;
}

export function useAxios() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async <T,>({
    endpoint,
    method = "GET",
    data = null,
    headers = {},
    ...config
  }: RequestOptions): Promise<AxiosResponse<T>> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const isFormData = data instanceof FormData;
      const requestHeaders = {
        ...headers,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Authorization: token ? `Bearer ${token}` : "",
      };

      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        method,
        data,
        headers: requestHeaders,
        ...config,
      });

      if (!response.data) {
        throw new Error("Нет данных в ответе");
      }

      return { data: response.data, error: null };
    } catch (err) {
      let errorMessage = "Произошла ошибка";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { request, isLoading, error };
}
