import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { userLogin, userLogout, userRefresh, userRegister } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/auth.js';

const router = express.Router();
const jsonParser = express.json();

router.post(
  '/auth/register',
  jsonParser,
  validateBody(registerSchema),
  ctrlWrapper(userRegister),
);

router.post(
  '/auth/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(userLogin),
);

router.post('/auth/logout', ctrlWrapper(userLogout));

router.post('/auth/refresh', ctrlWrapper(userRefresh));

export default router;
