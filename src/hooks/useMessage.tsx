import { useState, useCallback, useEffect, useRef } from "react";
import useUser from "./useUser";
import socketManager from "@/services/socketManager";

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
  const { user: currentUser } = useUser();
  const socket = useRef(socketManager.getSocket());
  const isInitialLoad = useRef(true);
  const lastSentMessage = useRef<{ text: string; timestamp: number } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !targetUserId || !currentUser?._id) return;

    if (isInitialLoad.current) {
      setIsLoading(true);
      isInitialLoad.current = false;
    }

    socket.current = socketManager.connect(token);

    const handleLoadMessages = (loadedMessages: Message[]) => {
      setMessages(loadedMessages);
      setIsLoading(false);
    };

    const handleReceiveMessage = (newMessage: Message) => {
      // Проверяем, не является ли это сообщение дубликатом последнего отправленного
      if (
        lastSentMessage.current &&
        newMessage.message_text === lastSentMessage.current.text &&
        newMessage.sender_id === currentUser._id &&
        Date.now() - lastSentMessage.current.timestamp < 1000
      ) {
        return;
      }

      if (newMessage.sender_id === targetUserId || newMessage.receiver_id === targetUserId) {
        setMessages((prev) => [...prev, newMessage]);
        return;
      }
      if (newMessage.sender_id !== currentUser._id) {
        socketManager.addUnreadMessage(newMessage.sender_id);
      }
    };

    const handleError = (error: any) => {
      setError(error.message);
      setIsLoading(false);
    };

    socketManager.joinRoom(targetUserId);
    socket.current?.emit("loadMessages", { targetUserId });

    socket.current?.on("loadMessages", handleLoadMessages);
    socket.current?.on("receiveMessage", handleReceiveMessage);
    socket.current?.on("error", handleError);

    return () => {
      if (socket.current) {
        socket.current.off("loadMessages", handleLoadMessages);
        socket.current.off("receiveMessage", handleReceiveMessage);
        socket.current.off("error", handleError);
      }
      isInitialLoad.current = true;
      lastSentMessage.current = null;
    };
  }, [targetUserId, currentUser?._id]);

  const sendMessage = useCallback(
    (messageText: string) => {
      if (!socket.current || !currentUser?._id || !targetUserId || !messageText.trim()) {
        return;
      }

      const trimmedMessage = messageText.trim();

      lastSentMessage.current = {
        text: trimmedMessage,
        timestamp: Date.now(),
      };

      const newMessage = {
        _id: Date.now().toString(),
        sender_id: currentUser._id,
        receiver_id: targetUserId,
        message_text: trimmedMessage,
        created_at: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);

      socket.current.emit("sendMessage", {
        targetUserId,
        messageText: trimmedMessage,
      });
    },
    [currentUser?._id, targetUserId]
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    isConnected: socket.current?.connected || false,
  };
};

export default useMessage;
