import { User, IUser } from "./userModel.js";
import { CreateUserInput, UpdateUserInput } from "../../types/index.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";

export const createUser = async (input: CreateUserInput): Promise<IUser> => {
  const user = new User({
    ...input,
    passwordHash: input.password ? await hashPassword(input.password) : null,
  });
  return user.save();
};

export const findById = async (id: string): Promise<IUser | null> => {
  return User.findById(id).exec();
};

export const findByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email: email.toLowerCase() }).exec();
};

export const findByUsername = async (username: string): Promise<IUser | null> => {
  return User.findOne({ name: { $regex: new RegExp(`^${username}$`, "i") } }).exec();
};

export const update = async (id: string, input: UpdateUserInput): Promise<IUser | null> => {
  return User.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true }).exec();
};

export const listUsers = async (page = 1, limit = 20): Promise<IUser[]> => {
  return User.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();
};

export const deleteById = async (id: string): Promise<IUser | null> => {
  return User.findByIdAndDelete(id).exec();
};

export { verifyPassword };
