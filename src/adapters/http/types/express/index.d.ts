import express from "express";

export type UserLogged = {
  userId: number;
  nickName: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserLogged
    }
  }
}