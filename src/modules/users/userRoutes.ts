import { Route } from "../../app/route.js";
import { getUser, getUserByUsername, getMe, updateMe } from "./userController.js";
import { userIdValidation, usernameValidation, updateProfileValidation } from "./userValidation.js";
import { validate } from "../../middleware/index.js";

export const userRoutes: Route[] = [
  { method: "get", path: "/users/:id", handler: getUser, middleware: [...userIdValidation, validate] },
  { method: "get", path: "/users/username/:username", handler: getUserByUsername, middleware: [...usernameValidation, validate] },
  { method: "get", path: "/users/me", handler: getMe },
  { method: "patch", path: "/users/me", handler: updateMe, middleware: [...updateProfileValidation, validate] },
];
