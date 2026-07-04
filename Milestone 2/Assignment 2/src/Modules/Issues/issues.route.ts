import { Router } from 'express';
import { IssuesController } from './issues.controller';
import auth from '../../middleware/auth';

const router = Router();

router.post('/', auth('contributor', 'maintainer'), IssuesController.createIssue);
router.get('/', IssuesController.getIssues);
router.get('/:id', IssuesController.getIssueById);
router.patch('/:id', auth('contributor', 'maintainer'), IssuesController.updateIssue);
router.delete('/:id', auth('maintainer'), IssuesController.deleteIssue);

export const IssuesRoutes = router;
