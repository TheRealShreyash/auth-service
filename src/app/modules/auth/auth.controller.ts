import type { Request, Response } from "express";
import { signUp } from "./auth.services";
import ApiResponse from "../../common/utils/api-response";

class AuthController {
  static async handleSignup(req: Request, res: Response) {
    const result = await signUp(req.body);
    ApiResponse.created(res, `User was created successfully.`, {
      id: result?.id,
    });
  }

  static async handleSignin(req: Request, res: Response) {
    
  }
}

export default AuthController;
