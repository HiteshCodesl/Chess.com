import { Chess } from 'chess.js'
import type { User } from './connection_handler.js';

type GameRoom = {
    gameId: string;
    players: User[];
    chess: Chess;
};

const games = new Map<string, GameRoom>();

export async function roomManager(blackPlayer: User, whitePlayer: User, gameId: string) {
    const chess = new Chess();

    games.set(gameId, {
        gameId,
        players: [blackPlayer, whitePlayer],
        chess
    })
}

export const getGame = (gameId: string) => {
    return games.get(gameId);
} 
