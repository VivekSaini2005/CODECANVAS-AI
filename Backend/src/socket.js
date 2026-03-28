// Store active user sockets: mapping userId -> socketId
const userSockets = new Map();

const setupSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Client sends their user ID when they connect
        socket.on("register", (userId) => {
            if (userId) {
                userSockets.set(userId.toString(), socket.id);
                console.log(`User ${userId} registered with socket ${socket.id}`);
            }
        });

        // Clean up on disconnect
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            for (let [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    userSockets.delete(userId);
                    break;
                }
            }
        });
    });
};

const getSocketId = (userId) => {
    if(!userId) return null;
    return userSockets.get(userId.toString());
};

module.exports = { setupSocket, getSocketId, userSockets };
