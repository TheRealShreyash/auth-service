import type { Response } from "express";
import ApiError from "./api-error";

class ApiResponse {
  static ok(res: Response, message: string, data?: any) {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  static created(res: Response, message: string, data?: any) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, error: Error, statusCode: number) {
    if (error instanceof ApiError) {
      return res.status(statusCode).json({
        success: false,
        error: error,
      });
    }
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

export default ApiResponse;
