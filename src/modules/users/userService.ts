import { ConflictError } from "../../middleware/index.js";
import * as userRepo from "./userRepository.js";
import { CreateUserInput, UpdateUserInput } from "../../types/index.js";
import { IUser } from "./userModel.js";

export const createUser = async (input: CreateUserInput): Promise<IUser> => {
  const existing = await userRepo.findByEmail(input.email);
  if (existing) throw new ConflictError("Email already registered");
  return userRepo.createUser(input);
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  return userRepo.findById(id);
};

export const getUserByUsername = async (username: string): Promise<IUser | null> => {
  return userRepo.findByUsername(username);
};

export const updateUser = async (id: string, input: UpdateUserInput): Promise<IUser | null> => {
  const user = await userRepo.findById(id);
  if (!user) throw new ConflictError("User not found");
  return userRepo.update(id, input);
};

export const listAllUsers = async (page = 1, limit = 20): Promise<IUser[]> => {
  return userRepo.listUsers(page, limit);
};
