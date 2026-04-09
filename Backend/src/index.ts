import express from "express";
import cors from "cors";
import { userRouter } from "./modules/User/user.js";
import { gameRouter } from "./modules/Game/Game.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/game', gameRouter);

export default app;