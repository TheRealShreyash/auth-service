import { randomBytes, createHmac } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "../../../db";
import { usersTable } from "../../../db/schema";
import type { SignInPayload, SignUpPayload } from "./auth.models";
import ApiError from "../../common/utils/api-error";
import {
  createEmailVerificationToken,
  createRefreshToken,
  createUserToken,
  verifyEmailVerificationToken,
  verifyRefreshToken,
} from "./utils/token";
import type { AuthenticatedRequest } from "../../common/utils/interfaces";
import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

export const signUp = async (payload: SignUpPayload) => {
  const { firstName, lastName, email, password } = payload;
  const userEmailResult = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (userEmailResult.length > 0)
    throw ApiError.conflict(
      `User with email ${userEmailResult} already exists`,
    );

  const salt = randomBytes(32).toString("hex");
  const hash = createHmac("sha256", salt).update(password).digest("hex");

  const [result] = await db
    .insert(usersTable)
    .values({
      firstName,
      lastName,
      email,
      password: hash,
      salt,
    })
    .returning({ id: usersTable.id });

  const verificationToken = createEmailVerificationToken({ email });
  const verificationLink = `http://localhost:${process.env.PORT || 8080}/auth/verify-email?token=${verificationToken}`;

  console.log(verificationLink);

  await sendVerificationMail(email, verificationLink);

  return result;
};

export const signin = async (payload: SignInPayload) => {
  const { email, password } = payload;

  const [userSelect] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!userSelect)
    throw ApiError.notFound(`User with email ${email} doesn't exist`);

  const salt = userSelect.salt!;
  const hash = createHmac("sha256", salt).update(password).digest("hex");

  if (userSelect.password !== hash)
    throw ApiError.badRequest(`Email or password is incorrect`);

  const accessToken = createUserToken({ id: userSelect.id });

  const refreshToken = createRefreshToken({ id: userSelect.id });

  await db
    .update(usersTable)
    .set({ refreshToken })
    .where(eq(usersTable.id, userSelect.id));

  return { accessToken: accessToken, refreshToken: refreshToken };
};

export const getMe = async (req: AuthenticatedRequest) => {
  const [userSelect] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.user!.id));

  if (!userSelect) {
    throw ApiError.notFound(`User with email ${req.user!.email} doesn't exist`);
  }

  const { password, salt, refreshToken, ...user } = userSelect;

  return user;
};

export const logout = async (req: AuthenticatedRequest) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) throw ApiError.badRequest("No refresh token found");

  await db
    .update(usersTable)
    .set({ refreshToken: null })
    .where(
      and(
        eq(usersTable.id, req.user!.id),
        eq(usersTable.refreshToken, refreshToken),
      ),
    );
};

export const verifyEmail = async (token: string) => {
  const payload = verifyEmailVerificationToken(token);

  if (!payload)
    throw ApiError.badRequest("Invalid or expired verification link");

  const [userSelect] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, payload.email));

  if (!userSelect)
    throw ApiError.notFound(`User with email ${payload.email} doesn't exist`);

  if (userSelect.emailVerified)
    throw ApiError.badRequest("Email already verified");

  await db
    .update(usersTable)
    .set({ emailVerified: true })
    .where(eq(usersTable.email, payload.email));
};

export const refreshToken = async (req: AuthenticatedRequest) => {
  const token = req.cookies["refreshToken"];

  if (!token) throw ApiError.badRequest("No refresh token found.");

  const payload = verifyRefreshToken(token);

  if (!payload) throw ApiError.unauthorized("Invalid refresh token");

  const [userSelect] = await db
    .select()
    .from(usersTable)
    .where(
      and(eq(usersTable.id, payload.id), eq(usersTable.refreshToken, token)),
    );

  if (!userSelect) throw ApiError.notFound("No user found");

  const accessToken = createUserToken({ id: userSelect.id });

  return accessToken;
};

const sendVerificationMail = async (email: string, link: string) => {
  const TOKEN = process.env.SMTP_TOKEN;

  const transport = nodemailer.createTransport(
    MailtrapTransport({
      token: TOKEN as string,
    }),
  );

  const sender = {
    address: "hello@demomailtrap.co",
    name: "Mailtrap Test",
  };

  const recipents = ["laughingride9@typingsquirrel.com"];

  await transport.sendMail({
    from: sender,
    to: recipents,
    subject: "You are awesome!",
    html: `<a href="${link}">Click here to verify!</a>`,
  });
};
