import WebSocket from "ws";
import { createGame } from "./game_handler.js";
import { prisma } from "../../lib/prisma.js";
import { JoinExistingGame, type Role } from "./joinExistingGame_handler.js";
import { getGame } from "./room_handler.js";
import { rebuildGame } from "./rebuildGame_handler.js";
import type { GameStatus } from "@prisma/client";

export interface User {
    id: string;
    name: string | 'anonymous';
    socket: WebSocket | null;
};

export interface Game {
    id: string;
    whiteId: string;
    blackId: string;
    fen: string;
    createdAt: Date;
    status: GameStatus;
    winnerId: string | null;
    winningReason: string | null
}


export let globalJoiningQueue: User[] = [];

export async function joinRoomInit(socket: WebSocket, payload: any) {
    const { id, name } = payload.data;

    const currentUser = {
        id,
        name,
        socket
    }

    //if server restated the game 
    const findRunningGame = await prisma.game.findFirst({
        where: {
            status: 'ACTIVE',
            OR: [
                { blackId: id },
                { whiteId: id }
            ]
        }
    })

    let role: Role;

    if (findRunningGame) {

        const gameId = findRunningGame.id;
        const fen = findRunningGame.fen ?? '';
        const game = getGame(gameId);

         if (findRunningGame.blackId === id) {
                role = 'blackPlayer';
            } else if (findRunningGame.whiteId === id) {
                role = 'whitePlayer';
            } else {
                return;
        }

        if (!game) {
            //server is crashed
            rebuildGame(gameId, role, findRunningGame, currentUser);
            
        } else {
            //player is disconnected

            JoinExistingGame(gameId, role, currentUser, fen);
        }

    } else {

        if (globalJoiningQueue.length === 0) {
            globalJoiningQueue.push({
                id,
                name,
                socket
            })
            console.log(globalJoiningQueue);
        }
        else if (globalJoiningQueue.length > 0) {
            //Removes first element and deletes it.
            const waitingUser = globalJoiningQueue.shift();

            if (!waitingUser) {
                console.log("User Not Found")
                return;
            }

            if (waitingUser.id === currentUser.id) {
                console.log("Same User");
                globalJoiningQueue.push(waitingUser);
                return;
            }

            createGame(waitingUser, currentUser);
        }
    }
}