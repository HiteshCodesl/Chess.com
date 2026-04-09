import { prisma } from "../../lib/prisma.js";
import { getGame } from "./room_handler.js";
import type WebSocket from "ws";

export async function moveHandler(from: string, to: string, gameId: string, socket: WebSocket) {
    try{
    const game = getGame(gameId);
    let winner: string;

    if (!game) {
        console.log("game not Found");
        return;
    }

    const chess = game.chess;

    const blackPlayerSocket = game.players[0]!.socket;
    const whitePlayerSocket = game.players[1]!.socket;

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

    game.players.forEach((player) => {
        player.socket.send(JSON.stringify({
            "EVENT": "MOVE",
            from,
            to,
            fen: chess.fen()
        }))
    })

    await prisma.move.create({
        data: {
            from,
            to,
            time: new Date(),
            gameId: gameId
        }
    })


    if (chess.isGameOver()) {
        const turn = chess.turn();
        winner = turn === 'w' ? 'black' : 'white';

        game.players.forEach((player) => {
            player.socket.send(JSON.stringify({
                "EVENT": "GAME_ENDED",
                result: chess.isCheckmate() ? "CheckMate" : "Draw",
                winner
            }))
        })

        await prisma.game.update({
            where: {
                id: gameId
            },
            data: {
                winnerId: '123', // to be calculated using winner,
                status: 'FINISHED'
            }
        })
    }

    if (chess.isDraw()) {
        game.players.forEach((player) => {
            player.socket.send(JSON.stringify({
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

  }catch(err){
    console.log("Invalid Move");
    return;
  }
}

