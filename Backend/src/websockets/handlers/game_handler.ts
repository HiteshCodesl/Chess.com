import type { User } from "./connection_handler.js";
import { prisma } from "../../lib/prisma.js";
import { roomHandler } from "./room_handler.js";
import { Chess } from "chess.js";

export async function createGame(waitingUser: User, currentUser: User) {
    const chess = new Chess();
    
    const createGame = await prisma.game.create({
        data: {
            blackId: currentUser.id,
            whiteId: waitingUser.id,
            status: "ACTIVE",
            fen: chess.fen()
        }
    })

    const gameId = createGame.id;

    currentUser.socket?.send(JSON.stringify({
        "event": "MATCH_FOUND",
        "gameId": gameId,
        "color": "black"
    }));

    waitingUser.socket?.send(JSON.stringify({
        "event": "MATCH_FOUND",
        "gameId": gameId,
        "color": "white"
    }));

    roomHandler(currentUser, waitingUser, gameId);
}