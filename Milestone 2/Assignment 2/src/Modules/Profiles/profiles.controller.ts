import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utility/sendResponce';
import { ProfilesService } from './profiles.service';

const getMyProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const profile = await ProfilesService.getProfileData(Number(userId));
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: profile,
  });
};

export const ProfilesController = {
  getMyProfile,
};
