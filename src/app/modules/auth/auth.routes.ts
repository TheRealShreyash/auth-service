import { Router } from "express";
import validate from "../../common/middleware/validate.middleware";
import { signInPayloadModel, signUpPayloadModel } from "./auth.models";
import AuthController from "./auth.controller";

const authRouter = Router();

authRouter.post(
  "/sign-up",
  validate(signUpPayloadModel),
  AuthController.handleSignup,
);

authRouter.post("/sign-in", validate(signInPayloadModel));

export default authRouter;
