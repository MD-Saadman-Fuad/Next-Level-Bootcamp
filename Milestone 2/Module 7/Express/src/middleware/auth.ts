import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

import type { ROLES } from "../types";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(roles);
    try{
      // console.log("This is protected route");\
    // console.log(req.headers.authorization);
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token as string, config.jwtSecretKey as string) as JwtPayload;

    // console.log(decoded);

    const userData = await pool.query(`
        SELECT * FROM users WHERE email = $1
    `, [decoded.email]);

    // console.log("User data from DB:", userData.rows[0]);

    const user = userData.rows[0];
    if (userData.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } 
    
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: User is not active",
      });
    }
    console.log(`User role from DB: ${user.role}`);
    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have the required role",
      });
    }
    req.user = decoded;

    next();
    }
    catch (error) {
      next(error);
    }
  };
};


export default auth;