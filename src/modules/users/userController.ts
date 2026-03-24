import { Request, Response } from "express";
import { NotFoundError } from "../../app/error.js";
import * as userRepo from "./userRepository.js";

export const getUser = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = await userRepo.findById(id);
  if (!user) throw new NotFoundError("User not found");
  res.json({ data: user });
};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const user = await userRepo.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  res.json({ data: user });
};

export const updateMe = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const user = await userRepo.update(userId, req.body);
  if (!user) throw new NotFoundError("User not found");
  res.json({ data: user });
};

export const getUserByUsername = async (req: Request, res: Response) => {
  const username = req.params.username as string;
  const user = await userRepo.findByUsername(username);
  if (!user) throw new NotFoundError("User not found");
  res.json({ data: user });
};
