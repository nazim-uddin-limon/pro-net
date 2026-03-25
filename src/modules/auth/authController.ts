import { Request, Response } from "express";
import * as authService from "./authService.js";
import { UnauthorizedError } from "../../middleware/index.js";

const getDeviceInfo = (req: Request): string => {
  return req.headers["user-agent"] || "Unknown";
};

const getIpAddress = (req: Request): string => {
  return req.headers["x-forwarded-for"]?.toString().split(",")[0] || 
         req.headers["x-real-ip"]?.toString() || 
         req.socket.remoteAddress || 
         "Unknown";
};

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  
  const result = await authService.register(
    email,
    password,
    name,
    getDeviceInfo(req),
    getIpAddress(req)
  );
  
  res.status(201).json({
    message: "Registration successful",
    data: {
      user: {
        id: result.user._id,
        email: result.user.email,
        name: result.user.name,
      },
      ...result.tokens,
      session: result.session,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password, singleDevice } = req.body;
  
  const result = await authService.login(
    email,
    password,
    getDeviceInfo(req),
    getIpAddress(req),
    singleDevice !== false
  );
  
  res.json({
    message: "Login successful",
    data: {
      user: {
        id: result.user._id,
        email: result.user.email,
        name: result.user.name,
      },
      ...result.tokens,
      session: result.session,
    },
  });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    throw new UnauthorizedError("Refresh token is required");
  }
  
  const tokens = await authService.refreshTokens(refreshToken);
  
  res.json({
    message: "Tokens refreshed",
    data: tokens,
  });
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  
  if (refreshToken) {
    await authService.logout(refreshToken);
  }
  
  res.json({
    message: "Logged out successfully",
  });
};

export const logoutAllDevices = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const count = await authService.logoutAllDevices(userId);
  
  res.json({
    message: `Logged out from ${count} device(s)`,
    data: { devicesLoggedOut: count },
  });
};

export const getSessions = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const sessions = await authService.getActiveSessions(userId);
  
  res.json({
    data: sessions,
  });
};

export const revokeSession = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const sessionId = req.params.sessionId as string;
  
  await authService.revokeSession(userId, sessionId);
  
  res.json({
    message: "Session revoked successfully",
  });
};
