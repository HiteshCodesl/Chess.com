import WebSocket from "ws";

type UserType = {
  name: string,
  socket: WebSocket
}

const userSocketMap = new Map<string, UserType>();

export const addUserSocket = (userId: string, socketId: WebSocket, name: string) => {
  userSocketMap.set(userId, {socket: socketId, name});
};

export const getSocket = (userId: string) => {
  return userSocketMap.get(userId);
};