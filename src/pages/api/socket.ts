import { Server } from "socket.io";
import { NextApiRequest } from "next";

export default function SocketHandler(req: NextApiRequest, res: any) {
    if (res.socket.server.io) {
        console.log("Socket is already running");
        res.end();
        return;
    }

    console.log("Initializing Socket.io server...");
    const io = new Server(res.socket.server, {
        path: "/api/socket",
        addTrailingSlash: false,
        transports: ["websocket", "polling"], // explicit transports
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
        console.log(`✅ Socket connected: ${socket.id}`);

        socket.on("join-room", (roomId: string) => {
            console.log(`🚪 Socket ${socket.id} joining room "${roomId}"`);
            socket.join(roomId);

            // Get all sockets in the room
            const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
            console.log(`📊 Room "${roomId}" now has ${socketsInRoom?.size || 0} members:`,
                Array.from(socketsInRoom || []).join(", "));
        });

        socket.on("draw", (data) => {
            console.log(`✏️ Draw event from ${socket.id} in room "${data.roomId}"`);
            const socketsInRoom = io.sockets.adapter.rooms.get(data.roomId);
            console.log(`   Broadcasting to ${(socketsInRoom?.size || 1) - 1} other clients in room`);
            socket.to(data.roomId).emit("draw", data);
        });

        socket.on("draw-end", (data) => {
            console.log(`🎨 Draw End event from ${socket.id} in room "${data.roomId}"`);
            const socketsInRoom = io.sockets.adapter.rooms.get(data.roomId);
            console.log(`   Broadcasting to ${(socketsInRoom?.size || 1) - 1} other clients in room`);
            socket.to(data.roomId).emit("draw-end", data);
        });

        socket.on("cursor-move", (data) => {
            socket.to(data.roomId).emit("cursor-move", data);
        });

        socket.on("undo", (data) => {
            console.log(`↩️ Undo event from ${socket.id} in room "${data.roomId}"`);
            socket.to(data.roomId).emit("undo", data.actionId);
        });

        socket.on("clear", (roomId) => {
            console.log(`🗑️ Clear event from ${socket.id} in room "${roomId}"`);
            socket.to(roomId).emit("clear");
        });

        socket.on("disconnect", () => {
            console.log(`❌ Socket disconnected: ${socket.id}`);
        });
    });

    console.log("Socket server initialized");
    res.end();
}
