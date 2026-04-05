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

    const currentUser = {
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
        const waitingUser = globalJoiningQueue[0];

        if (!waitingUser) {
            console.log("User Not Found")
            return;
        }

        createGame(waitingUser, currentUser);

        globalJoiningQueue = globalJoiningQueue.filter(x => x.id !== waitingUser?.id);
    }
}