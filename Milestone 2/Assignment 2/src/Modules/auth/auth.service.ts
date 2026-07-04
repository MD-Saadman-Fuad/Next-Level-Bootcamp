import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { UserService } from '../User/user.service';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../utility/AppError';
import { TUserRole } from '../../types';

// Typed payloads instead of `any`
interface ISignupPayload {
  name: string;
  email: string;
  password: string;
  role?: TUserRole;
}

interface ILoginPayload {
  email: string;
  password: string;
}

const VALID_ROLES: TUserRole[] = ['contributor', 'maintainer'];

const signup = async (payload: ISignupPayload) => {
  const { name, email, password, role } = payload;
  
  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required', StatusCodes.BAD_REQUEST);
  }

  // Validate role if provided
  if (role && !VALID_ROLES.includes(role)) {
    throw new AppError('Role must be either "contributor" or "maintainer"', StatusCodes.BAD_REQUEST);
  }

  // Check if user already exists
  const existingUser = await UserService.findUserByEmail(email);
  if (existingUser) {
    throw new AppError('User with this email already exists', StatusCodes.BAD_REQUEST);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds);

  // Create user
  const newUser = await UserService.createUser({
    name,
    email,
    password: hashedPassword,
    role: role || 'contributor',
  });

  return newUser;
};

const login = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new AppError('Email and password are required', StatusCodes.BAD_REQUEST);
  }

  // Find user
  const user = await UserService.findUserByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  // Compare password
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  // Generate JWT payload containing id, name, and role
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, config.jwtSecret, {
    expiresIn: '7d',
  });

  // Exclude password from the returned user object
  const { password: _, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
};

export const AuthService = {
  signup,
  login,
};
