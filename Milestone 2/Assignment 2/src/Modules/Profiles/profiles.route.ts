import { Router } from 'express';
import { ProfilesController } from './profiles.controller';
import auth from '../../middleware/auth';

const router = Router();

router.get('/my-profile', auth('contributor', 'maintainer'), ProfilesController.getMyProfile);

export const ProfilesRoutes = router;
