import type { User } from "./connection_handler.js";

export function createGame(user1: User, user2: User){
    const blackPlayer = user1;
    const whitePlayer = user2;
    
    blackPlayer.socket.send({
        "message": "User Found"
    })
}