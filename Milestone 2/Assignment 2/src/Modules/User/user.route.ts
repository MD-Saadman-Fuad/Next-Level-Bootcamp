import { Router } from 'express';
import { UserController } from './user.controller';
import auth from '../../middleware/auth';

const router = Router();

router.get('/me', auth('contributor', 'maintainer'), UserController.getMe);

export const UserRoutes = router;
