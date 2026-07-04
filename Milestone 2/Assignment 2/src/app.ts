/// <reference path="./middleware/index.d.ts" />
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './middleware/globalErrorHandler';
import logger from './middleware/logger';
import { AuthRoutes } from './Modules/auth/auth.route';
import { UserRoutes } from './Modules/User/user.route';
import { ProfilesRoutes } from './Modules/Profiles/profiles.route';
import { IssuesRoutes } from './Modules/Issues/issues.route';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(logger);

// API Routes
app.use('/api/auth', AuthRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/profiles', ProfilesRoutes);
app.use('/api/issues', IssuesRoutes);

// Root Welcome Route
app.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Welcome to the DevPulse API server',
  });
});

// Handle undefined routes
app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'API route not found',
  });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
