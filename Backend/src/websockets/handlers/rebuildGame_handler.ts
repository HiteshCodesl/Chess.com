import { Chess } from "chess.js";
import type { Game, User } from "./connection_handler.js";
import { games, getGame } from "./room_handler.js";
import { prisma } from "../../lib/prisma.js";
import { JoinExistingGame, type Role } from "./joinExistingGame_handler.js";


export async function rebuildGame(gameId: string, role: Role,  game: Game, currentUser: User) {
    const chess = new Chess(game.fen);

    games.set(gameId, {
        gameId,
        chess,
        players: {
            whitePlayer: {
                id: game.whiteId,
                socket: null,
                name: 'white'
            },
            blackPlayer: {
                id: game.blackId,
                socket: null,
                name: 'black'
            }
        }
    })

    JoinExistingGame(gameId, role, currentUser, game.fen)
}