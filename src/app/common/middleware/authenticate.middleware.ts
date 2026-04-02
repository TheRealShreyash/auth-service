import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error";
import { verifyUserToken } from "../../modules/auth/utils/token";

export const authenticate = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    if (!header) next();

    if (!header?.startsWith("Bearer")) {
      throw ApiError.badRequest(`Authorization header must start with bearer`);
    }

    const token = header.split(" ")[1];
    if (!token)
      throw ApiError.badRequest(
        "Authorization header must start with Bearer followed by the token",
      );

    const user = verifyUserToken(token);
    // @ts-ignore
    req.user = user;
  };
};

export const restrictToAuthenticatedUser = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (!req.user) throw ApiError.unauthorized("Authentication required");
    return next();
  };
};
