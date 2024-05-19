import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = ( err: any, req: Request, res: Response,
  next: NextFunction  ) => 
{
  err.statusCode = err.statusCode || 500;
  err.message = err.message || `Internal server error`;

  //wrong mongoodb id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} extend`;
    err = new ErrorHandler(message, 400);
  }

  //wrong jwt error
  if (err.name === `JsonWebTokenError`) {
    const message = `Веб-токен Json недействителен Json web token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  //jwt expired error
  if (err.name === `TokenExpiredError`) {
    const message = `Срок действия веб-токена Json истек  Json web token is expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
