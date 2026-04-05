import { Chess } from 'chess.js'
import type { User } from './connection_handler.js';

type GameRoom = {
    gameId: string;
    players: User[];
    chess: Chess;
};

const games = new Map<string, GameRoom>();

//storing all the game in Memory
export async function roomManager(player1: User, player2: User, gameId: string) {
    const chess = new Chess();

    games.set(gameId, {
        gameId,
        players: [player1, player2],
        chess
    })
}
  

export const getGame = (gameId: string) => {
    return games.get(gameId);
} 
