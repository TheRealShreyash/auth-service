import type { Request } from "express";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  emailVerified: boolean;
  refreshToken?: string;
  salt?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
  cookies: Record<string, string>;
}
