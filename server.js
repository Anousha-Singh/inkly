const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    });

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`✅ Socket connected: ${socket.id}`);

        socket.on("join-room", (roomId) => {
            console.log(`🚪 Socket ${socket.id} joining room "${roomId}"`);
            socket.join(roomId);

            const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
            console.log(`📊 Room "${roomId}" now has ${socketsInRoom?.size || 0} members:`,
                Array.from(socketsInRoom || []).join(", "));
        });

        socket.on("draw", (data) => {
            const socketsInRoom = io.sockets.adapter.rooms.get(data.roomId);
            socket.to(data.roomId).emit("draw", data);
        });

        socket.on("draw-end", (data) => {
            const socketsInRoom = io.sockets.adapter.rooms.get(data.roomId);
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

    httpServer
        .once('error', (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
