import type { Request, Response } from "express";
import { signin, signUp } from "./auth.services";
import ApiResponse from "../../common/utils/api-response";
import ApiError from "../../common/utils/api-error";

class AuthController {
  static async handleSignup(req: Request, res: Response) {
    try {
      const result = await signUp(req.body);
      ApiResponse.created(res, `User was created successfully.`, {
        id: result?.id,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        return ApiResponse.error(res, error.message, error.statusCode);
      }

      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  }

  static async handleSignin(req: Request, res: Response) {
    try {
      const token = await signin(req.body);
      ApiResponse.ok(res, `Signed in`, { token });
    } catch (error) {
      if (error instanceof ApiError) {
        return ApiResponse.error(res, error.message, error.statusCode);
      }

      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  }
}

export default AuthController;
