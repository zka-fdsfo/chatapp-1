import express from "express";

import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./router/auth.route.js";
import cookieParser from "cookie-parser";
import userRouter from "./router/user.route.js";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.set("trust proxy", true);

app.use("/api/auth", authRouter);

app.use("/api/users", userRouter);
export default app;
