import { Session, ISession } from "./sessionModel.js";

export const createSession = async (
  userId: string,
  refreshToken: string,
  deviceInfo: string,
  ipAddress: string
): Promise<ISession> => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const session = new Session({
    userId,
    refreshToken,
    deviceInfo,
    ipAddress,
    expiresAt,
  });

  return session.save();
};

export const findSessionByToken = async (refreshToken: string): Promise<ISession | null> => {
  return Session.findOne({ refreshToken, isActive: true }).exec();
};

export const findActiveSessionsByUser = async (userId: string): Promise<ISession[]> => {
  return Session.find({ userId, isActive: true }).sort({ createdAt: -1 }).exec();
};

export const invalidateSession = async (refreshToken: string): Promise<ISession | null> => {
  return Session.findOneAndUpdate(
    { refreshToken },
    { isActive: false },
    { new: true }
  ).exec();
};

export const invalidateAllUserSessions = async (userId: string): Promise<number> => {
  const result = await Session.updateMany(
    { userId, isActive: true },
    { isActive: false }
  );
  return result.modifiedCount;
};

export const invalidateAllExceptCurrent = async (userId: string, currentToken: string): Promise<number> => {
  const result = await Session.updateMany(
    { userId, isActive: true, refreshToken: { $ne: currentToken } },
    { isActive: false }
  );
  return result.modifiedCount;
};

export const cleanExpiredSessions = async (): Promise<number> => {
  const result = await Session.deleteMany({
    expiresAt: { $lt: new Date() },
  });
  return result.deletedCount;
};
