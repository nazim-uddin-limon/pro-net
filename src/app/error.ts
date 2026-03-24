import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(409, message);
  }
}

export class ValidationError extends AppError {
  constructor(public errors: Record<string, string[]>) {
    super(400, "Validation failed");
  }
}

interface ErrorResponse {
  status: "error";
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  stack?: string;
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isDev = process.env.NODE_ENV !== "production";

  if (err instanceof ValidationError) {
    const response: ErrorResponse = {
      status: "error",
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    };
    if (isDev) response.stack = err.stack;
    return res.status(err.statusCode).json(response);
  }

  if (err instanceof AppError) {
    const response: ErrorResponse = {
      status: "error",
      statusCode: err.statusCode,
      message: err.message,
    };
    if (isDev) response.stack = err.stack;
    return res.status(err.statusCode).json(response);
  }

  console.error("UNEXPECTED ERROR:", err);
  const response: ErrorResponse = {
    status: "error",
    statusCode: 500,
    message: "Internal server error",
  };
  if (isDev) response.stack = err.stack;
  res.status(500).json(response);
};

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError("Route not found"));
};
