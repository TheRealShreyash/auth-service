import type { Request, Response } from "express";
import { getMe, signin, signUp } from "./auth.services";
import ApiResponse from "../../common/utils/api-response";

class AuthController {
  static async handleSignup(req: Request, res: Response) {
    try {
      const result = await signUp(req.body);
      ApiResponse.created(res, `User was created successfully.`, {
        id: result?.id,
      });
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  static async handleSignin(req: Request, res: Response) {
    try {
      const token = await signin(req.body);
      ApiResponse.ok(res, `Signed in`, { token });
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  static async handleMe(req: Request, res: Response) {
    try {
      const user = await getMe(req);
      ApiResponse.ok(res, "User found", user);
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }
}

export default AuthController;
