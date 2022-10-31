import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import userRouter from "./routes/user.router";
import { AppError } from "./errors/appError";

const app = express();
app.use(express.json());

app.use("/users", userRouter);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: "error",
        message: err.message,
      });
    }
    console.error(err);
    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
);

export default app;
