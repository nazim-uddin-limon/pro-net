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

const getRefreshTokenFromCookie = (req: Request): string | undefined => {
  const cookies = req.headers.cookie;
  if (!cookies) return undefined;
  
  const match = cookies.match(/refresh_token=([^;]+)/);
  return match ? match[1] : undefined;
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
  
  res.cookie("refresh_token", result.tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  
  res.status(201).json({
    message: "Registration successful",
    data: {
      user: {
        id: result.user._id,
        email: result.user.email,
        name: result.user.name,
      },
      accessToken: result.tokens.accessToken,
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
  
  res.cookie("refresh_token", result.tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  
  res.json({
    message: "Login successful",
    data: {
      user: {
        id: result.user._id,
        email: result.user.email,
        name: result.user.name,
      },
      accessToken: result.tokens.accessToken,
    },
  });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = getRefreshTokenFromCookie(req);
  
  if (!refreshToken) {
    throw new UnauthorizedError("Refresh token is required");
  }
  
  const tokens = await authService.refreshTokens(refreshToken);
  
  res.cookie("refresh_token", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  
  res.json({
    message: "Tokens refreshed",
    data: {
      accessToken: tokens.accessToken,
    },
  });
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = getRefreshTokenFromCookie(req);
  
  if (refreshToken) {
    await authService.logout(refreshToken);
  }
  
  res.clearCookie("refresh_token");
  
  res.json({
    message: "Logged out successfully",
  });
};

export const logoutAllDevices = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const count = await authService.logoutAllDevices(userId);
  
  res.clearCookie("refresh_token");
  
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
