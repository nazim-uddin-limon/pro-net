import { User, IUser } from "../users/userModel.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";

export const createUser = async (email: string, password: string, name: string): Promise<IUser> => {
  const passwordHash = await hashPassword(password);
  const user = new User({ email, passwordHash, name });
  return user.save();
};

export const findByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email: email.toLowerCase() }).exec();
};

export const validateCredentials = async (email: string, password: string): Promise<IUser | null> => {
  const user = await findByEmail(email);
  if (!user || !user.passwordHash) return null;
  
  const isValid = await verifyPassword(password, user.passwordHash);
  return isValid ? user : null;
};
