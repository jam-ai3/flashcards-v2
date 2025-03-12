import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET, SESSION_KEY } from "../routes/auth";
import { Session } from "../types";

export async function errorBoundary(
  req: Request,
  res: Response,
  execute: (req: Request, res: Response) => Promise<any>
) {
  try {
    execute(req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export function getSession(req: Request): Session | null {
  const token = req.cookies[SESSION_KEY];
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return null;
    }
    return decoded as Session;
  } catch {
    return null;
  }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies[SESSION_KEY];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.session = decoded as Session;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
}

export function isSubscribed(subscriptionEnd: number | null) {
  return subscriptionEnd !== null && subscriptionEnd > Date.now();
}

export function getLimitAndOffset(req: Request, maxLimit: number = 10) {
  let { limit, offset }: { limit?: number; offset?: number } = req.query;
  if (!limit || limit < 1) {
    limit = maxLimit;
  }
  if (!offset || offset < 0) {
    offset = 0;
  }
  return { limit, offset };
}
