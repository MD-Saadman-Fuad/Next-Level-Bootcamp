import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
const registerUser = async (req: Request, res: Response) => {
  try{
    const payload = req.body;

  const user = await userService.registerUserIntoDB(payload);

  res.status(httpStatus.CREATED).json({
    success: true,
    success_code: httpStatus.CREATED,
    message: "User registration endpoint",
    data: {
      user,
    },
  });
  }
  catch(error){
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      success_code: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error registering user",
      error: (error as Error).message,
    });
  }
};

export const userController = {
  registerUser,
};
