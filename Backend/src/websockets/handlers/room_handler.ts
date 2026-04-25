import { Chess } from 'chess.js'
import type { User } from './connection_handler.js';

type GameRoom = {
    gameId: string;
    players: {
        whitePlayer: User,
        blackPlayer: User
    }
    chess: Chess;
    clock: {
        whiteTime: number;
        blackTime: number;
        lastMoveTime: number;
        turn: "w" | "b";
    } | null;
};

export const games = new Map<string, GameRoom>();

export async function roomHandler(blackPlayer: User, whitePlayer: User, gameId: string, gameTime: number) {
    const chess = new Chess();

    games.set(gameId, {
        gameId,
        chess,
        players: {
            whitePlayer,
            blackPlayer,
        },
        clock: null
    })
}

export const getGame = (gameId: string) => {
    return games.get(gameId);
} 
