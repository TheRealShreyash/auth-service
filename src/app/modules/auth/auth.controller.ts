import type { Request, Response } from "express";
import { signin, signUp } from "./auth.services";
import ApiResponse from "../../common/utils/api-response";

class AuthController {
  static async handleSignup(req: Request, res: Response) {
    const result = await signUp(req.body);
    ApiResponse.created(res, `User was created successfully.`, {
      id: result?.id,
    });
  }

  static async handleSignin(req: Request, res: Response) {
    const token = await signin(req.body);
    ApiResponse.ok(res, `Signed in`, { token });
  }
}

export default AuthController;
