import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"], // ✅ Ensure stable connection
  reconnection: true, // ✅ Auto-reconnect if disconnected
  reconnectionAttempts: 10, // ✅ Maximum retry attempts
  reconnectionDelay: 3000, // ✅ 3 seconds before retrying
});

socket.on("connect", () => {
  console.log(`✅ Connected to Socket.IO server: ${socket.id}`);
});

socket.on("disconnect", (reason) => {
  console.warn(`⚠️ Socket disconnected: ${reason}`);
  if (reason === "io server disconnect") {
    socket.connect(); // ✅ Reconnect manually if the server disconnects
  }
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error.message);
});

socket.on("notification", (data) => {
  console.log("🔔 New Notification:", data);
});

// ✅ Clean up event listeners when needed
const cleanupSocket = () => {
  socket.off("notification");
  socket.off("connect");
  socket.off("disconnect");
  socket.off("connect_error");
};

export { socket, cleanupSocket };
