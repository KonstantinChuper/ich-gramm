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
  const { user } = useUser();

  // Инициализация сокета
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      auth: { token },
    });

    setSocket(newSocket);

    // Обработка ошибок подключения
    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setError("Ошибка подключения к серверу");
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Подключение к комнате и загрузка истории сообщений
  useEffect(() => {
    if (!socket || !user?._id || !targetUserId) return;

    setIsLoading(true);
    setError(null);

    // Создаем ID комнаты из ID пользователей (сортируем для консистентности)
    const roomId = [user._id, targetUserId].sort().join("-");

    // Присоединяемся к комнате
    socket.emit("joinRoom", roomId);

    // Запрашиваем историю сообщений
    socket.emit("loadMessages", {
      userId: user._id,
      targetUserId,
    });

    // Слушаем загруженные сообщения
    socket.on("loadMessages", (loadedMessages: Message[]) => {
      setMessages(loadedMessages);
      setIsLoading(false);
    });

    // Слушаем новые сообщения
    socket.on("receiveMessage", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    // Слушаем ошибки
    socket.on("error", (err) => {
      console.error("Socket error:", err);
      setError("Произошла ошибка");
      setIsLoading(false);
    });

    return () => {
      // Покидаем комнату при размонтировании
      socket.emit("leaveRoom", roomId);

      // Отписываемся от всех событий
      socket.off("loadMessages");
      socket.off("receiveMessage");
      socket.off("error");
    };
  }, [socket, user?._id, targetUserId]);

  // Отправка сообщения
  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!socket || !user?._id || !targetUserId) {
        setError("Не удалось отправить сообщение");
        return;
      }

      if (!messageText.trim()) {
        return;
      }

      try {
        const roomId = [user._id, targetUserId].sort().join("-");

        socket.emit("sendMessage", {
          userId: user._id,
          targetUserId,
          messageText: messageText.trim(),
          roomId,
        });
      } catch (err) {
        console.error("Error sending message:", err);
        setError("Ошибка при отправке сообщения");
      }
    },
    [socket, user?._id, targetUserId]
  );

  // Очистка сообщений (например, при смене собеседника)
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Проверка статуса соединения
  const isConnected = socket?.connected;

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    isConnected,
  };
};

export default useMessage;
