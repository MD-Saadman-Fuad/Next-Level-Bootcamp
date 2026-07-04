import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { StatusCodes } from 'http-status-codes';

const auth = (...roles: ('contributor' | 'maintainer')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.headers.authorization;
      if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Unauthorized: Missing token',
        });
      }

      // Handle both "Bearer <token>" and raw "<token>"
      if (token.startsWith('Bearer ')) {
        token = token.slice(7);
      }

      const decoded = jwt.verify(token, config.jwtSecret) as { id: number; name: string; role: 'contributor' | 'maintainer' };
      req.user = decoded;

      // Role check
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: 'Forbidden: Insufficient permissions',
        });
      }

      next();
    } catch (error) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Unauthorized: Invalid or expired token',
      });
    }
  };
};

export default auth;
