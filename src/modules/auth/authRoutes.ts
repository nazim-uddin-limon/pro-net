import { Route } from "../../app/route.js";
import { register, login, refresh, logout, logoutAllDevices, getSessions, revokeSession } from "./authController.js";
import { registerValidation, loginValidation } from "./authValidation.js";
import { validate } from "../../middleware/index.js";
import { authenticate } from "./authMiddleware.js";

export const authRoutes: Route[] = [
  {
    method: "post",
    path: "/auth/register",
    handler: register,
    middleware: [...registerValidation, validate],
  },
  {
    method: "post",
    path: "/auth/login",
    handler: login,
    middleware: [...loginValidation, validate],
  },
  {
    method: "post",
    path: "/auth/refresh",
    handler: refresh,
  },
  {
    method: "post",
    path: "/auth/logout",
    handler: logout,
  },
  {
    method: "post",
    path: "/auth/logout-all",
    handler: logoutAllDevices,
    middleware: [authenticate],
  },
  {
    method: "get",
    path: "/auth/sessions",
    handler: getSessions,
    middleware: [authenticate],
  },
  {
    method: "delete",
    path: "/auth/sessions/:sessionId",
    handler: revokeSession,
    middleware: [authenticate],
  },
];
