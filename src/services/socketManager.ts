import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let currentRoom: string | null = null;
let unreadMessages: Record<string, number> = {};

// Инициализация непрочитанных сообщений
if (typeof window !== "undefined") {
  unreadMessages = JSON.parse(localStorage.getItem("unreadMessages") || "{}");
}

export const connect = (token: string) => {
  if (socket?.connected) return socket;

  socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("Socket connected");
    if (currentRoom) {
      joinRoom(currentRoom);
    }
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socket;
};

export const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  currentRoom = null;
};

export const joinRoom = (targetUserId: string) => {
  if (socket) {
    if (currentRoom) {
      socket.emit("leaveRoom", { targetUserId: currentRoom });
    }
    socket.emit("joinRoom", { targetUserId });
    currentRoom = targetUserId;
  }
};

export const getSocket = () => socket;

export const addUnreadMessage = (userId: string) => {
  unreadMessages[userId] = (unreadMessages[userId] || 0) + 1;
  localStorage.setItem("unreadMessages", JSON.stringify(unreadMessages));
};

export const clearUnreadMessages = (userId: string) => {
  unreadMessages[userId] = 0;
  localStorage.setItem("unreadMessages", JSON.stringify(unreadMessages));
};

export const getUnreadMessages = () => unreadMessages;

export default {
  connect,
  disconnect,
  joinRoom,
  getSocket,
  addUnreadMessage,
  clearUnreadMessages,
  getUnreadMessages,
};
