import express from "express";

export type UserLogged = {
  userId: number;
  nickName: string;
  nome: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserLogged
    }
  }
}