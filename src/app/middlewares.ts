import express from "express";
import cors from "cors";
import morgan from "morgan";
import { Request, Response } from "express";
import { AppError, errorHandler, notFoundHandler } from "./error.js";

const defaultMiddlewares = [express.json(), cors(), morgan("dev")];

type AsyncFn = (req: Request, res: Response, next: Function) => Promise<unknown>;

export const asyncHandler = (fn: AsyncFn) => {
  return (req: Request, res: Response, next: Function) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

export { AppError, errorHandler, notFoundHandler } from "./error.js";
export default defaultMiddlewares;
