import { Router } from "express";
import validate from "../../common/middleware/validate.middleware";
import {
  signInPayloadModel,
  signUpPayloadModel,
} from "./auth.models";
import AuthController from "./auth.controller";
import { restrictToAuthenticatedUser } from "../../common/middleware/authenticate.middleware";

const authRouter = Router();

authRouter.post(
  "/sign-up",
  validate(signUpPayloadModel),
  AuthController.handleSignup,
);

authRouter.post(
  "/sign-in",
  validate(signInPayloadModel),
  AuthController.handleSignin,
);

authRouter.get("/me", restrictToAuthenticatedUser(), AuthController.handleMe);

authRouter.post(
  "/logout",
  restrictToAuthenticatedUser(),
  AuthController.handleLogout,
);

authRouter.get(
  "/verify-email",
  AuthController.handleVerifyEmail,
);

export default authRouter;
