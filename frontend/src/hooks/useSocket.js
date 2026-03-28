import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

export const useSocket = (userId) => {
  const [activeSocket, setActiveSocket] = useState(null);

  useEffect(() => {
    if (!userId) return;

    if (!socket) {
      socket = io("http://localhost:5000"); // Match with backend URL
    }

    const handleConnect = () => {
      socket.emit("register", userId);
    };

    socket.on("connect", handleConnect);

    if (socket.connected) {
      handleConnect();
    }

    setActiveSocket(socket);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [userId]);

  return activeSocket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
