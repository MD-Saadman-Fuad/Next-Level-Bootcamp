import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { config } from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  if (user.activeStatus === "BLOCKED") {
    throw new Error("User is not active");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  //   const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret,
  //     {
  //     expiresIn: config.jwt_access_expires_in,
  //     } as jwt.SignOptions);
  const accessToken = jwtUtils.createTokens(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  //   const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret,
  //     {
  //     expiresIn: config.jwt_refresh_expires_in,
  //     } as jwt.SignOptions);

  const refreshToken = jwtUtils.createTokens(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return { user, accessToken, refreshToken };
};

const refreshToken =
  async (refreshToken: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);
    if (!verifiedRefreshToken.success) {
      throw new Error("Invalid refresh token");
    }
    // return verifiedRefreshToken;
    const {id} = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
    if(user.activeStatus === "BLOCKED") {
      throw new Error("User is not active");
    }
    const jwtPayload = {
      id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const newAccessToken = jwtUtils.createTokens(
      jwtPayload,
      config.jwt_access_secret,
      config.jwt_access_expires_in as SignOptions,
    );
    
    return { newAccessToken };
  };


export const authService = {
  loginUser,
  refreshToken,
};
