import { Route } from "../../app/route.js";
import { getUser, getUserByUsername, getMe, updateMe } from "./userController.js";

export const userRoutes: Route[] = [
  { method: "get", path: "/users/:id", handler: getUser },
  { method: "get", path: "/users/username/:username", handler: getUserByUsername },
  { method: "get", path: "/users/me", handler: getMe },
  { method: "patch", path: "/users/me", handler: updateMe },
];
