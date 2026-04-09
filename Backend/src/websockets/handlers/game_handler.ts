import type { User } from "./connection_handler.js";
import { prisma } from "../../lib/prisma.js";
import { roomManager } from "./room_handler.js";

export async function createGame(waitingUser: User, currentUser: User) {

    const createGame = await prisma.game.create({
        data: {
            blackId: currentUser.id,
            whiteId: waitingUser.id,
            status: "WAITING"
        }
    })

    const gameId = createGame.id;

    currentUser.socket.send(JSON.stringify({
        "event": "matchFound",
        "gameId": gameId,
        "color": "black"
    }));

    waitingUser.socket.send(JSON.stringify({
        "event": "matchFound",
        "gameId": gameId,
        "color": "white"
    }));

    roomManager(currentUser, waitingUser, gameId);
}