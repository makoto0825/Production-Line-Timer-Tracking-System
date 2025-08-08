import { Router } from 'express';
import { createSession } from '../controllers/sessionController';

const router = Router();

// POST /api/sessions
router.post('/', createSession);

export default router;
