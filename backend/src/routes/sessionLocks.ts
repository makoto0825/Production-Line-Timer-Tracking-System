import { Router } from 'express';
import { acquireLock, releaseLock } from '../controllers/sessionLockController';

const router = Router();

router.post('/session-locks/acquire', acquireLock);
router.post('/session-locks/release', releaseLock);

export default router;
