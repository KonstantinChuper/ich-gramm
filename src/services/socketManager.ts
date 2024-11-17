import { io, Socket } from "socket.io-client";

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private messageHandlers: Map<string, Set<Function>> = new Map();
  private unreadMessages: Record<string, number> = {};
  private currentRoom: string | null = null;

  private constructor() {
    if (typeof window !== "undefined") {
      this.unreadMessages = JSON.parse(localStorage.getItem("unreadMessages") || "{}");
    }
  }

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect(token: string) {
    if (this.socket?.connected) return this.socket;

    this.socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("Socket connected");
      if (this.currentRoom) {
        this.joinRoom(this.currentRoom);
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentRoom = null;
  }

  joinRoom(targetUserId: string) {
    if (this.socket) {
      if (this.currentRoom) {
        this.socket.emit("leaveRoom", { targetUserId: this.currentRoom });
      }
      this.socket.emit("joinRoom", { targetUserId });
      this.currentRoom = targetUserId;
    }
  }

  getSocket() {
    return this.socket;
  }

  addUnreadMessage(userId: string) {
    this.unreadMessages[userId] = (this.unreadMessages[userId] || 0) + 1;
    localStorage.setItem("unreadMessages", JSON.stringify(this.unreadMessages));
  }

  clearUnreadMessages(userId: string) {
    this.unreadMessages[userId] = 0;
    localStorage.setItem("unreadMessages", JSON.stringify(this.unreadMessages));
  }

  getUnreadMessages() {
    return this.unreadMessages;
  }
}

export default SocketManager.getInstance();
