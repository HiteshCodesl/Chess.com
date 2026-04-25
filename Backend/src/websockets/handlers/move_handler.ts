import { time } from "console";
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

        game.clock.turn = chess.turn();

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
            to,
            promotion: "q"
        })


        console.log("Move", move);

        if (!move) {
            socket.send(JSON.stringify({
                event: "INVALID_MOVE"
            }));
            return;
        }

        const now = Date.now();

        const timeStamp = now - game.clock.lastMoveTime;

        if (chess.turn() === 'w') {
            game.clock.whiteTime -= timeStamp; 
        } else {
            game.clock.blackTime -= timeStamp;
        }

        const players = [
            game.players.whitePlayer,
            game.players.blackPlayer
        ]

        if (chess.isGameOver()) {
            if (chess.isCheckmate()) {
                const turn = chess.turn();
                winner = turn === 'w' ? 'black' : 'white';

                players.forEach((player) => {
                    player.socket?.send(JSON.stringify({
                        "event": "GAME_ENDED",
                        result: chess.isCheckmate() ? "CheckMate" : "Draw",
                        winner
                    }))
                })

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

            } else if (chess.isDraw()) {

                players.forEach((player) => {
                    player.socket?.send(JSON.stringify({
                        result: 'Draw'
                    }))
                })

                await prisma.game.update({
                    where: {
                        id: gameId
                    },
                    data: {
                        status: "DRAW"
                    }
                })
            }
        }

        if (chess.isCheck()) {
            players.forEach((player) => {
                player.socket?.send(JSON.stringify({
                    "event": "CHECK"
                }))
            })
        }

        players.forEach((player) => {
            player.socket?.send(JSON.stringify({
                "event": "MOVE",
                from,
                to,
                fen: chess.fen(),
                turn: chess.turn()
            }));
        })

        await prisma.move.create({
            data: {
                from,
                to,
                time: new Date(),
                gameId: gameId
            }
        }),

            await prisma.game.update({
                where: {
                    id: gameId
                },
                data: {
                    fen: chess.fen()
                }
            })


    } catch (err) {
        console.log("Invalid Move", err);
        return;
    }
}

