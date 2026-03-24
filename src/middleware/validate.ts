import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ValidationError } from "../app/error.js";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors: Record<string, string[]> = {};
    errors.array().forEach((err) => {
      const field = "path" in err ? err.path : "unknown";
      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }
      formattedErrors[field]?.push(err.msg);
    });
    throw new ValidationError(formattedErrors);
  }
  next();
};
