import { prisma } from "../../lib/prisma.js";
import { getGame } from "./room_handler.js";

export async function moveHandler(from: string, to: string, gameId: string) {

    const game = getGame(gameId);

    if (!game) {
        console.log("game not Found");
        return;
    }

    const chess = game.chess;

    const move = chess.move({
        from,
        to
    })

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

    console.log("date", new Date().getTime());

    await prisma.move.create({
        data: {
            from,
            to,
            time: new Date(),
            gameId: gameId
        }
    })

    if (chess.isGameOver()) {
        game.players.forEach((player) => {
            player.socket.send(JSON.stringify({
                "EVENT": "GAME_ENDED",
                result: chess.isCheckmate() ? "CheckMate" : "Draw"
            }))
        })
    }

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


//validate move
//is this users move time

//update board
//push the move

//check the game is over
//send the updated game to both the players