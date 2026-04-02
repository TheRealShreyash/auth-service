import type { NextFunction, Request, Response } from "express";
import type BaseDto from "../dto/base.dto";
import ApiError from "../utils/api-error";

const validate = (DtoClass: typeof BaseDto) => {
  return (req: Request, _: Response, next: NextFunction) => {
    const { errors, value } = DtoClass.validate(req.body);

    if (errors) {
      throw ApiError.badRequest(errors.join("; "));
    }
    req.body = value;
    next();
  };
};

export default validate;
