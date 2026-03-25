import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/jwt.js";
import { UnauthorizedError } from "../../middleware/index.js";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    throw new UnauthorizedError("No authorization header provided");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new UnauthorizedError("Invalid authorization header format");
  }

  const token = parts[1];
  
  if (!token) {
    throw new UnauthorizedError("Token is missing");
  }

  try {
    const decoded = verifyToken(token);
    (req as any).userId = decoded.userId;
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return next();
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return next();
  }

  const token = parts[1];
  
  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token);
    (req as any).userId = decoded.userId;
  } catch {
    // Ignore invalid tokens for optional auth
  }
  
  next();
};
