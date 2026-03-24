import { User, CreateUserInput, UpdateUserInput } from "../../types/index.js";
import crypto from "crypto";

const users: Map<string, User> = new Map();

const generateId = () => crypto.randomUUID();

export const createUser = (input: CreateUserInput): User => {
  const user: User = {
    id: generateId(),
    email: input.email,
    passwordHash: input.password ? hashPassword(input.password) : null,
    name: input.name,
    headline: null,
    bio: null,
    avatarUrl: null,
    bannerUrl: null,
    location: null,
    website: null,
    openToWork: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  users.set(user.id, user);
  return user;
};

export const findById = (id: string): User | undefined => {
  return users.get(id);
};

export const findByEmail = (email: string): User | undefined => {
  return Array.from(users.values()).find((u) => u.email === email);
};

export const findByUsername = (username: string): User | undefined => {
  return Array.from(users.values()).find((u) => u.name.toLowerCase() === username.toLowerCase());
};

export const update = (id: string, input: UpdateUserInput): User => {
  const user = users.get(id);
  if (!user) throw new Error("User not found");
  const updated = { ...user, ...input, updatedAt: new Date() };
  users.set(id, updated);
  return updated;
};

export const listUsers = (page = 1, limit = 20): User[] => {
  const all = Array.from(users.values());
  const start = (page - 1) * limit;
  return all.slice(start, start + limit);
};

const hashPassword = (password: string): string => {
  return crypto.createHash("sha256").update(password).digest("hex");
};
