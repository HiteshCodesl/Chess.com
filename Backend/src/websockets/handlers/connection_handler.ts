import { globalAgent } from "node:http";
import type WebSocket from "ws";
import { createGame } from "./game_handler.js";

export interface User {
    id: string,
    name: string,
    socket: WebSocket
}[];

export let globalJoiningQueue: User[] = [];

export function joinRoomInit(socket: WebSocket, payload: any) {
    const { id, name } = payload.data;

    const user2 = {
        id,
        name,
        socket
    }

    if (globalJoiningQueue.length === 0) {
        globalJoiningQueue.push({
            id,
            name,
            socket
        })
    }

    else if (globalJoiningQueue.length > 0) {
        const user1 = globalJoiningQueue[0];

        if (!user1) {
            console.log("User Not Found")
            return;
        }

        createGame(user1, user2);

        globalJoiningQueue = globalJoiningQueue.filter(x => x.id !== user1?.id);
    }
}