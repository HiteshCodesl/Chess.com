import React, { createContext, useEffect, useState } from "react";

export const SocketContext = createContext<WebSocket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => {
            console.log("Websocket Connected");
            setSocket(ws);
        }

        ws.onclose = () => {
            console.log("Websocket Disconnected");
            ws.close();
        }

        return () => ws.close();

    }, [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
    
}