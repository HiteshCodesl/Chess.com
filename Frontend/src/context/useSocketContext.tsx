import { useEffect, useState } from "react"

const WS_URL = 'ws://localhost:3000';

export const useSocketContext = () => {
    const [socket, setSocket] = useState <WebSocket | null>(null);

    useEffect(() => {
        
        const ws = new WebSocket(WS_URL);
        
        ws.onopen = () => {
            console.log("Ws Connected");
            setSocket(ws);
        }

        ws.onclose = () => {
            console.log("ws Disconnected");
            setSocket(null);
        }

        return () => {
            ws.close();
        }

    }, [])

    return socket;
}