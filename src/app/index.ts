import express from "express";
import authRouter from "./modules/auth/auth.routes";
import { authenticate } from "./common/middleware/authenticate.middleware";

export function createApplication() {
  const app = express();

  app.use(express.json());
  app.use(authenticate());

  app.get("/", (_, res) => {
    return res.json({ message: "Welcome to the auth service" });
  });

  app.use("/auth", authRouter);
  return app;
}
