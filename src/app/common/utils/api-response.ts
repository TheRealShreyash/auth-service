import type { Response } from "express";

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

  static error(res: Response, error: string, statusCode: number) {
    return res.status(statusCode).json({
      success: false,
      error: error,
    });
  }
}

export default ApiResponse;
