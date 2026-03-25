import express, { Express } from "express";
import defaultMiddlewares, { errorHandler, notFoundHandler } from "./middlewares.js";
import { createRouter, healthCheck } from "./route.js";
import { userRoutes } from "../modules/users/index.js";
import { authRoutes } from "../modules/auth/index.js";

const app: Express = express();

app.use(defaultMiddlewares);

const apiRouter = createRouter([
  { method: "get", path: "/health", handler: healthCheck },
  ...authRoutes,
  ...userRoutes,
]);

app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
