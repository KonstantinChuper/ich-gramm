import { useState, useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import useUser from "./useUser";

interface Message {
  _id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  created_at: Date;
}

export const useMessage = (targetUserId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user: currentUser } = useUser();

  // Инициализация сокета
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !targetUserId) return;

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      auth: { token },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      // Присоединяемся к комнате при подключении
      const roomId = [currentUser?._id, targetUserId].sort().join("_");
      newSocket.emit("joinRoom", { targetUserId });
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setError("Connection error");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [targetUserId, currentUser?._id]);

  // Загрузка сообщений и обработка новых
  useEffect(() => {
    if (!socket) return;

    setIsLoading(true);

    // Загрузка истории сообщений
    socket.emit("loadMessages", { targetUserId });

    // Обработчики событий
    socket.on("loadMessages", (loadedMessages: Message[]) => {
      setMessages(loadedMessages);
      setIsLoading(false);
    });

    socket.on("receiveMessage", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("error", (err) => {
      setError(err.message);
      setIsLoading(false);
    });

    return () => {
      socket.off("loadMessages");
      socket.off("receiveMessage");
      socket.off("error");
    };
  }, [socket, targetUserId]);

  // Отправка сообщения
  const sendMessage = useCallback(
    (messageText: string) => {
      if (!socket || !currentUser?._id || !targetUserId || !messageText.trim()) {
        return;
      }

      const roomId = [currentUser._id, targetUserId].sort().join("_");

      socket.emit("sendMessage", {
        targetUserId,
        messageText: messageText.trim(),
        roomId,
      });
    },
    [socket, currentUser?._id, targetUserId]
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    isConnected: socket?.connected || false,
  };
};

export default useMessage;
