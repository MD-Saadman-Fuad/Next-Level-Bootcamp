import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";



const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const {accessToken, refreshToken} = await authService.loginUser(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    });

    sendResponse(res, {
        success: true,
        success_code: httpStatus.OK,
        message: "User logged in successfully",
        data: {
            accessToken,
            refreshToken
        },
    });
})

const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies.refreshToken;

    const {newAccessToken} = await authService.refreshToken(refreshToken);
    
    res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    sendResponse(res, {
        success: true,
        success_code: httpStatus.OK,
        message: "Token refreshed successfully",
        data: { newAccessToken },
    });
})


export const authController = {
    loginUser,
    refreshToken
}