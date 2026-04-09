import { WebSocketServer } from 'ws';
import { joinRoomInit } from './handlers/connection_handler.js';
import { moveHandler } from './handlers/move_handler.js';

export const webSocketServer = (server: any) => {

const wss = new WebSocketServer({server})

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {

    const payload = JSON.parse(data.toString());

    if (payload.type === "INIT_JOIN") {
      joinRoomInit(ws, payload)   
    }
     else if (payload.type === "MOVE") {
      moveHandler(payload.data.from, payload.data.to, payload.data.gameId, ws);
    }
  });

});

}