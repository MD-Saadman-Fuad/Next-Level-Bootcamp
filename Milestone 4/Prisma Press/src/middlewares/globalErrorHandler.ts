import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode;
  let errorMessage = err.message || "Internal Server Error";
  let errorName = err.name || "Internal Server Error";

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorMessage =
      "You have provided invalid data. Please check your request and try again.";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpStatus.CONFLICT;
      errorMessage = "A record with the specified criteria already exists.";
    } else if (err.code === "P2003") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage =
        "Foreign key constraint failed. Please check your request and try again.";
    } else if (err.code === "P2025") {
      statusCode = httpStatus.NOT_FOUND;
      errorMessage =
        "An Operation failed because it depends on one or more records that were required but not found. Please check your request and try again.";
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    // statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    // errorMessage =
    //   "Authentication Failed. Prisma Client failed to initialize. Please check your database connection and try again.";
    if (err.errorCode == "P1000") {
      statusCode = httpStatus.UNAUTHORIZED;
      errorMessage =
        "Authentication Failed. Please check your database connection and try again.";
    } else if (err.errorCode == "P1001") {
      statusCode = httpStatus.SERVICE_UNAVAILABLE;
      errorMessage =
        "Canty reach database server. Please check your database connection and try again.";
    }
  }else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    errorMessage =
      "An unknown error occurred while processing the request. Please try again later.";
  }

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    success_code: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    // errorCode: err.code || null,
    name: errorName,
    message: errorMessage,
    error: err.stack,
  });
};
