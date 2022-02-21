import express, { NextFunction, Response } from "express";
import "express-async-errors";

import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import AppError from "./../../errors/AppError";
import { router } from "./routes/index";

const app = express();

const allowedOrigins = ["http://localhost:3000", "https://chat-drab-one.vercel.app/"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: "*",
  }
});

io.on("connection", (socket) => {
  console.log(`connected on id ${socket.id}`);
});

app.use(express.json());

app.use(router);

app.use(
  (
    err: Error,
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message}`,
    });
  }
);

export { app, serverHttp, io };
