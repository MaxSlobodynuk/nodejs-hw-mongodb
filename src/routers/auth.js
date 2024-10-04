import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { userLogin, userLogout, userRegister } from '../controllers/auth.js';
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

export default router;
