import { WebSocketServer } from 'ws';
import { joinRoomInit } from './handlers/connection_handler.js';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    
    const payload = JSON.parse(data.toString());

    console.log("payload", payload);

    joinRoomInit(ws, payload)
  });

  ws.send('something');
});

