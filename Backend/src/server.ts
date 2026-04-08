import http from "http"
import app from './index.js'

console.log("Inside server.ts");
import { webSocketServer } from "./websockets/socket.js"

const server = http.createServer(app);
console.log("Before passing server to websocket")
webSocketServer(server);
console.log("after passing server to websocket")

server.listen(3000, () => console.log("server is running on port 3000"));