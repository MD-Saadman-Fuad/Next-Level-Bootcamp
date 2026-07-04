import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utility/sendResponce';

const getMe = async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: req.user,
  });
};

export const UserController = {
  getMe,
};
