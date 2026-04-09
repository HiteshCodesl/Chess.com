import http from "http"
import app from './index.js'

import { webSocketServer } from "./websockets/socket.js"

const server = http.createServer(app);
webSocketServer(server);

server.listen(3000, () => console.log("server is running on port 3000"));