import { Router } from 'express';
import { validateBuildNumber } from '../controllers/buildController';

const router = Router();

// Build Number validation endpoint
router.get('/validate/:buildNumber', validateBuildNumber);

export default router;
