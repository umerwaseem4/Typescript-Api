import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authRequest } from "../types";

export default async function (
  req: authRequest,
  res: Response,
  next: NextFunction
): Promise<any> {
  const token: string | undefined = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization failed" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
}
