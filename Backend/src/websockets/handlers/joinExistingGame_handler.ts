import type { User } from "./connection_handler.js";
import { getGame } from "./room_handler.js";

type UserType = User;

export type Role = 'whitePlayer' | 'blackPlayer';

export async function JoinExistingGame(gameId: string, role: Role, user: UserType, fen: string) {
    const game = getGame(gameId);
    const chess = game?.chess;
    if (!game) {
        console.log("Game Not Found, Try Matchmaking")
        return;
    }

    if (role === 'blackPlayer') {
        game.players.blackPlayer.socket = user.socket;
    } else if (role === 'whitePlayer') {
        game.players.whitePlayer.socket = user.socket;
    } else {
        console.log("error", "You are not part of this game");
        return;
    }

    user.socket?.send(JSON.stringify({
        "event" : "MATCH_RESUMED",
        "gameId" : gameId,
        "role": role,
        "turn": chess?.turn(),
        "fen": fen
   }))
}