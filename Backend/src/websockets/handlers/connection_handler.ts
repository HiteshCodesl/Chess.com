import WebSocket from "ws";
import { createGame } from "./game_handler.js";

export interface User {
    id: string,
    name: string,
    socket: WebSocket
};

export let globalJoiningQueue: User[] = [];

export function joinRoomInit(socket: WebSocket, payload: any) {
    const { id, name } = payload.data;

    const currentUser = {
        id,
        name,
        socket
    }

    console.log("currentUser", currentUser);
    console.log(globalJoiningQueue);

    if (globalJoiningQueue.length === 0) {
        globalJoiningQueue.push({
            id,
            name,
            socket
        })
        console.log(globalJoiningQueue);
    }
    else if (globalJoiningQueue.length > 0) {
        const waitingUser = globalJoiningQueue.shift();
        //Removes first element and deletes it.
        
        if (!waitingUser) {
            console.log("User Not Found")
            return;
        }

        if(waitingUser.id === currentUser.id){
            console.log("Same User");  
            globalJoiningQueue.push(waitingUser);
            return;
        }
    
        createGame(waitingUser, currentUser);
    }
}