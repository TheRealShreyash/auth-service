import JWT from "jsonwebtoken";

export interface UserTokenPayload {
  id: string;
}

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

export function createEmailVerificationToken(email: string) {
  return JWT.sign(email, JWT_EMAIL_VERIFICATION_SECRET); // lets keep it permanent for now.
}

export function verifyEmailVerificationToken(token: string) {
  try {
    return JWT.verify(token, JWT_EMAIL_VERIFICATION_SECRET) as string;
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
