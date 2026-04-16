import JWT from "jsonwebtoken";
import type {
  EmailVerificationPayload,
  UserTokenPayload,
} from "../../../common/utils/interfaces";

const JWT_SECRET = process.env.JWT_SECRET || "youshallnotpass";

const JWT_REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_TOKEN_SECRET || "dontpassthis";

const JWT_EMAIL_VERIFICATION_SECRET =
  process.env.JWT_EMAIL_VERIFICATION_SECRET || "thisisemailverification";

export function createUserToken(payload: UserTokenPayload) {
  const token = JWT.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  return token;
}

export function createRefreshToken(payload: UserTokenPayload) {
  const refreshToken = JWT.sign(payload, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "24h",
  });
  return refreshToken;
}

export function createEmailVerificationToken(
  payload: EmailVerificationPayload,
) {
  return JWT.sign(payload, JWT_EMAIL_VERIFICATION_SECRET, { expiresIn: "1d" });
}

export function verifyEmailVerificationToken(token: string) {
  try {
    return JWT.verify(
      token,
      JWT_EMAIL_VERIFICATION_SECRET,
    ) as EmailVerificationPayload;
  } catch (error) {
    return null;
  }
}

export function verifyUserToken(token: string) {
  try {
    const payload = JWT.verify(token, JWT_SECRET) as UserTokenPayload;
    return payload;
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    const payload = JWT.verify(
      token,
      JWT_REFRESH_TOKEN_SECRET,
    ) as UserTokenPayload;
    return payload;
  } catch (error) {
    return null;
  }
}
