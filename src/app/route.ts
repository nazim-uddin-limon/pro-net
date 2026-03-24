import { Router, Request, Response } from "express";
import { asyncHandler } from "./middlewares.js";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

type Handler = (req: Request, res: Response, next: Function) => Promise<void>;

export interface Route {
  method: HttpMethod;
  path: string;
  handler: Handler;
  middleware?: any[];
}

export const createRouter = (routes: Route[]) => {
  const router = Router();

  routes.forEach(({ method, path, handler, middleware = [] }) => {
    router[method](path, ...middleware, asyncHandler(handler));
  });

  return router;
};

export const registerRoutes = (router: Router, routes: Route[]) => {
  routes.forEach(({ method, path, handler, middleware = [] }) => {
    router[method](path, ...middleware, asyncHandler(handler));
  });
};

export const healthCheck = async (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};
