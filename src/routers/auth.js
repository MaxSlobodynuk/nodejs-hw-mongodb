import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { userRegister } from '../controllers/auth.js';

const router = express.Router();
const jsonParser = express.json();

router.post('/auth/register', jsonParser, ctrlWrapper(userRegister));

export default router;