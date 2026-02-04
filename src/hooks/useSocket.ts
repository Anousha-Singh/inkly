import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const onConnect = () => {
            console.log("Socket connected:", socket.id);
            setIsConnected(true);
        };
        const onDisconnect = () => {
            console.log("Socket disconnected");
            setIsConnected(false);
        };
        const onConnectError = (err: any) => {
            console.error("Socket connection error:", err);
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onConnectError);

        // Connect to the socket server
        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', onConnectError);
            // socket.disconnect();  <-- Removing this to prevent aggressive disconnects on re-renders
        };
    }, []);

    return { socket, isConnected };
};
