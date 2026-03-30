import express from "express";

export function createApplication() {
  const app = express();

  app.use(express.json());

  app.get("/", (_, res) => {
    return res.json({ message: "Welcome to the auth service" });
  });

  return app;
}
