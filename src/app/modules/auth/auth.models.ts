import { z } from "zod";

export const signUpPayloadModel = z.object({
  firstName: z.string().min(2),
  lastName: z.string().nullable().optional(),
  email: z.email(),
  password: z.string().min(6),
});

export const signInPayloadModel = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const emailVerifcationPayloadModel = z.object({
  email: z.email(),
});

export type SignUpPayload = z.infer<typeof signUpPayloadModel>;
export type SignInPayload = z.infer<typeof signInPayloadModel>;
export type EmailVerifcationPayload = z.infer<
  typeof emailVerifcationPayloadModel
>;
