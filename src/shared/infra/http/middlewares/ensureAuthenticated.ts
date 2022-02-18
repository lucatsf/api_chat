import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import auth from "../../../../config/auth";
import { prisma } from "../../../../database/prismaClient";
import AppError from "../../../errors/AppError";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw (new AppError("Token missing!"), 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub } = verify(
      token,
      auth.secret_refresh_token
    ) as IPayload;

    request.user_id = sub;

    const user = await prisma.user.findFirst({
      where: {
        id: sub
      }
    });

    if (!user) {
      throw new AppError("User does not exists!", 401);
    }

    next();
  } catch (error) {
    throw new AppError("Invalid token!", 423);
  }
}
