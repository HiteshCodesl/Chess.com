import { prisma } from "../../lib/prisma.js";
import { getGame } from "./room_handler.js";
import type WebSocket from "ws";

export async function moveHandler(from: string, to: string, gameId: string, socket: WebSocket) {
    try {
        const game = getGame(gameId);
        let winner: string;

        if (!game) {
            console.log("game not Found");
            return;
        }

        const chess = game.chess;

        const blackPlayerSocket = game.players.blackPlayer.socket;
        const whitePlayerSocket = game.players.whitePlayer.socket;

        const blackPlayerId = game.players.blackPlayer.id;
        const whitePlayerId = game.players.whitePlayer.id;

        if (chess.turn() === 'w' && socket !== whitePlayerSocket) {
            console.log("Invalid Move, White players turn");
            return;
        }

        if (chess.turn() === 'b' && socket !== blackPlayerSocket) {
            console.log("Invalid Move, Black players turn");
            return;
        }

        const move = chess.move({
            from,
            to
        })

        console.log("Move", move);

        if (!move) {
            console.log("Move not made");
            return;
        }

        const blackandWhitePlayerSockets: WebSocket | null = game.players.whitePlayer.socket && game.players.blackPlayer.socket;

        if (chess.isGameOver()) {
            const turn = chess.turn();
            winner = turn === 'w' ? 'black' : 'white';

            blackandWhitePlayerSockets?.send(JSON.stringify({
                "event": "GAME_ENDED",
                result: chess.isCheckmate() ? "CheckMate" : "Draw",
                winner
            }))


            await prisma.game.update({
                where: {
                    id: gameId
                },
                data: {
                    winnerId: chess.turn() === 'w' ? blackPlayerId : whitePlayerId,
                    status: 'FINISHED',
                    winningReason: 'checkmate'
                }
            })
        }

        if (chess.isDraw()) {

            blackandWhitePlayerSockets?.send(JSON.stringify({
                result: 'Draw'
            }))


            await prisma.game.update({
                where: {
                    id: gameId
                },
                data: {
                    status: "DRAW"
                }
            })
        }

        if(chess.isCheck()){
            if(chess.isCheck())
            blackandWhitePlayerSockets?.send(JSON.stringify({
                "event": "CHECK"
            }))
        }
        

        blackandWhitePlayerSockets?.send(JSON.stringify({
            "event": "MOVE",
            from,
            to,
            fen: chess.fen()
        }));

    await prisma.$transaction([

        prisma.move.create({
            data: {
                from,
                to,
                time: new Date(),
                gameId: gameId
            }
        }),

        prisma.game.update({
           where: {
             id: gameId
           },
           data: {
            fen: chess.fen()
           }
        })
    ])

    } catch (err) {
        console.log("Invalid Move");
        return;
    }
}

