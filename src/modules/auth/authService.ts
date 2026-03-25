import * as authRepo from "./authRepository.js";
import * as sessionRepo from "./sessionRepository.js";
import { IUser } from "../users/userModel.js";
import { ConflictError, UnauthorizedError, ForbiddenError } from "../../middleware/index.js";
import { signToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface AuthResult {
  user: IUser;
  tokens: TokenPair;
  session: { deviceInfo: string; ipAddress: string };
}

export const register = async (
  email: string,
  password: string,
  name: string,
  deviceInfo?: string,
  ipAddress?: string
): Promise<AuthResult> => {
  const existingUser = await authRepo.findByEmail(email);
  if (existingUser) {
    throw new ConflictError("Email already registered");
  }

  const user = await authRepo.createUser(email, password, name);
  const tokens = generateTokens(user._id.toString());
  
  await sessionRepo.createSession(
    user._id.toString(),
    tokens.refreshToken,
    deviceInfo || "Unknown",
    ipAddress || "Unknown"
  );

  return {
    user,
    tokens,
    session: { deviceInfo: deviceInfo || "Unknown", ipAddress: ipAddress || "Unknown" },
  };
};

export const login = async (
  email: string,
  password: string,
  deviceInfo?: string,
  ipAddress?: string,
  singleDevice = true
): Promise<AuthResult> => {
  const user = await authRepo.validateCredentials(email, password);
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const userId = user._id.toString();
  const tokens = generateTokens(userId);

  if (singleDevice) {
    await sessionRepo.invalidateAllUserSessions(userId);
  } else {
    await sessionRepo.invalidateAllExceptCurrent(userId, tokens.refreshToken);
  }

  await sessionRepo.createSession(
    userId,
    tokens.refreshToken,
    deviceInfo || "Unknown",
    ipAddress || "Unknown"
  );

  return {
    user,
    tokens,
    session: { deviceInfo: deviceInfo || "Unknown", ipAddress: ipAddress || "Unknown" },
  };
};

export const refreshTokens = async (refreshToken: string): Promise<TokenPair> => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  const session = await sessionRepo.findSessionByToken(refreshToken);
  if (!session || !session.isActive) {
    throw new UnauthorizedError("Session has been invalidated");
  }

  if (new Date() > session.expiresAt) {
    await sessionRepo.invalidateSession(refreshToken);
    throw new UnauthorizedError("Refresh token has expired");
  }

  const tokens = generateTokens(decoded.userId);
  
  await sessionRepo.invalidateSession(refreshToken);
  await sessionRepo.createSession(
    decoded.userId,
    tokens.refreshToken,
    session.deviceInfo,
    session.ipAddress
  );

  return tokens;
};

export const logout = async (refreshToken: string): Promise<void> => {
  await sessionRepo.invalidateSession(refreshToken);
};

export const logoutAllDevices = async (userId: string): Promise<number> => {
  return sessionRepo.invalidateAllUserSessions(userId);
};

export const getActiveSessions = async (userId: string): Promise<any[]> => {
  const sessions = await sessionRepo.findActiveSessionsByUser(userId);
  return sessions.map((s) => ({
    id: s._id,
    deviceInfo: s.deviceInfo,
    ipAddress: s.ipAddress,
    createdAt: s.createdAt,
    expiresAt: s.expiresAt,
  }));
};

export const revokeSession = async (userId: string, sessionId: string): Promise<boolean> => {
  const session = await sessionRepo.findActiveSessionsByUser(userId);
  const targetSession = session.find((s) => s._id.toString() === sessionId);
  
  if (!targetSession) {
    throw new ForbiddenError("Session not found");
  }

  await sessionRepo.invalidateSession(targetSession.refreshToken);
  return true;
};

const generateTokens = (userId: string): TokenPair => {
  return {
    accessToken: signToken(userId),
    refreshToken: signRefreshToken(userId),
  };
};
