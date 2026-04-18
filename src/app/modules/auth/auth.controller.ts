import type { Request, Response } from "express";
import {
  getMe,
  logout,
  refreshToken,
  resendVerificationEmail,
  signin,
  signUp,
  verifyEmail,
} from "./auth.services";
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
      const { accessToken, refreshToken } = await signin(req.body);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
      ApiResponse.ok(res, `Signed in`, { accessToken });
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

  static async handleLogout(req: Request, res: Response) {
    try {
      await logout(req);
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      ApiResponse.ok(res, "Logged out successfully");
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  static async handleVerifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.query as { token: string };
      await verifyEmail(token);

      ApiResponse.ok(res, "Email verified successfully");
    } catch (error) {
      ApiResponse.error(res, error);
    }
  }

  static async handleRefreshToken(req: Request, res: Response) {
    try {
      const accessToken = await refreshToken(req);
      ApiResponse.ok(res, "Token refreshed successfully", {
        accessToken: accessToken,
      });
    } catch (error) {
      ApiResponse.error(res, error);
    }
  }

  static async handleResendVerificationEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;

      await resendVerificationEmail(email);

      ApiResponse.ok(res, "Verification email sent successfully");
    } catch (error) {
      console.log(error);
      ApiResponse.error(res, error);
    }
  }
}

export default AuthController;
