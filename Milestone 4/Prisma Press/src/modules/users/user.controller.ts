import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { config } from "../../config";
import jwt from "jsonwebtoken";
import { jwtUtils } from "../../utils/jwt";


const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload);

    sendResponse(res, {
        success: true,
        success_code: httpStatus.CREATED,
        message: "User registered successfully",
        data: {
            user,
        },
    });


  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    

    const {accessToken} = req.cookies;
    console.log("Cookies:", accessToken);
    // res.send("Get my profile");

    const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);
    console.log("Verified Token:", verifiedToken);

    if (typeof verifiedToken === "string") {
        throw new Error(verifiedToken);
    }


    const profile = await userService.getMyProfileFromDB(verifiedToken.id);

    sendResponse(res, {
        success: true,
        success_code: httpStatus.OK,
        message: "Profile retrieved successfully",
        data: {
            profile,
        },
    });
  },
);



export const userController = {
  registerUser,
    getMyProfile
};
