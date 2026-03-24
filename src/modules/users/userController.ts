import { Request, Response } from "express";
import { NotFoundError } from "../../app/error.js";

export const getUser = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { findById } = await import("./userRepository.js");
  const user = findById(id);
  if (!user) throw new NotFoundError("User not found");
  res.json({ data: user });
};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { findById } = await import("./userRepository.js");
  const user = findById(userId);
  if (!user) throw new NotFoundError("User not found");
  res.json({ data: user });
};

export const updateMe = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { update } = await import("./userRepository.js");
  const user = update(userId, req.body);
  res.json({ data: user });
};

export const getUserByUsername = async (req: Request, res: Response) => {
  const username = req.params.username as string;
  const { findByUsername } = await import("./userRepository.js");
  const user = findByUsername(username);
  if (!user) throw new NotFoundError("User not found");
  res.json({ data: user });
};
