import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from './auth.service';
import sendResponse from '../../utility/sendResponce';

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.signup(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.login(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  signup,
  login,
};
