import type { Response } from "express";

type TResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  error?: unknown;
  statusCode?: number;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode ?? 200).json({
    success: data.success ?? true,
    message: data.message ?? "Request processed successfully",
    data: data.data ?? null,
    error: data.error ?? null,
  });
};

export default sendResponse;