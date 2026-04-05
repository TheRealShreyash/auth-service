import { randomBytes, createHmac } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { usersTable } from "../../../db/schema";
import type { SignInPayload, SignUpPayload } from "./auth.models";
import ApiError from "../../common/utils/api-error";
import { createRefreshToken, createUserToken } from "./utils/token";
import type { AuthenticatedRequest } from "../../common/utils/interfaces";

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
    .where(eq(usersTable.id, req.user.id));

  if (!userSelect) {
    throw ApiError.notFound(`User with email ${req.user.id} doesn't exist`);
  }

  const { password, salt, ...user } = userSelect;

  return user;
};
