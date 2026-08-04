import { Request, Response } from "express";
import httpStatus from "http-status";

export const notFound = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    success_code: httpStatus.NOT_FOUND,
    path: req.originalUrl,
    date: Date(),
    message: "Route Not Found",
    data: new Date().toISOString(),
  });
};
