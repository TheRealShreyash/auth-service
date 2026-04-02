import type { NextFunction, Request, Response } from "express";
import type { ZodObject } from "zod";
import ApiError from "../utils/api-error";

const validate = (schema: ZodObject<any>) => {
  return (req: Request, _: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message).join("; ");
      throw ApiError.badRequest(errors);
    }

    req.body = result.data;
    next();
  };
};

export default validate;
