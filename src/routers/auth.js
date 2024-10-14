import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getGoogleOAuthUrlController,
  loginWithGoogleController,
  sendResetEmail,
  sendResetPwd,
  userLogin,
  userLogout,
  userRefresh,
  userRegister,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  loginWithGoogleOAuthSchema,
} from '../validation/auth.js';

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

router.post(
  '/auth/send-reset-email',
  jsonParser,
  validateBody(requestResetEmailSchema),
  ctrlWrapper(sendResetEmail),
);

router.post(
  '/auth/reset-pwd',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(sendResetPwd),
);

router.get('/auth/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

router.post(
  '/auth/confirm-oauth',
  jsonParser,
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);


export default router;
