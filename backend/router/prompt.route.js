import express from 'express';
import { sendPrompt } from '../controller/prompt.controller.js';

const router = express.Router();

router.post('/prompt', sendPrompt)


export default router;