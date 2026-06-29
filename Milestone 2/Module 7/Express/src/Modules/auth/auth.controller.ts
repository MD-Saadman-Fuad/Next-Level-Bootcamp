import type { Request, Response } from "express"
import { authService } from "./auth.service";


const loginUser = async (req: Request, res: Response) => {
 try{

    const result = await authService.loginUserIntoDB(req.body);

    const {  refreshToken } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: false, // Set to true in production
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: result,
        });
 }
    catch (error : any) {
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            error: error
        });
    }
}

const refreshToken = async (req: Request, res: Response) => {
    try{

    const result = await authService.generateRefreshToken(req.cookies.refreshToken);

    

    res.status(200).json({
            success: true,
            message: "Access token generated successfully",
            data: result,
        });
 }
    catch (error : any) {
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            error: error
        });
    }
}


export const authController = {
    loginUser,
    refreshToken
}