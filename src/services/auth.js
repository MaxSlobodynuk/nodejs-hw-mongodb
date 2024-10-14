import bcrypt from 'bcrypt';
import crypto, { randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  SMTP,
  JWT_SECRET,
  TEMPLATES_DIR,
  APP_DOMAIN,
} from '../constants/index.js';
import { sendMail } from '../utils/sendMail.js';
import { env } from '../utils/env.js';
import { validateCode } from '../utils/googleOAuth2.js';

const createSession = () => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  };
};

export const registerUser = async (user) => {
  const maybeUser = await User.findOne({ email: user.email });
  console.log({ maybeUser });

  if (maybeUser) {
    throw createHttpError(409, 'Email in use');
  }

  user.password = await bcrypt.hash(user.password, 10);

  const result = await User.create(user);

  return result;
};

export const loginUser = async (email, password) => {
  const maybeUser = await User.findOne({ email });

  if (!maybeUser) {
    throw createHttpError(404, 'User not found');
  }

  const isMatch = await bcrypt.compare(password, maybeUser.password);

  if (isMatch === false) {
    throw createHttpError(401, 'Unauthorize');
  }

  await Session.deleteOne({ userId: maybeUser._id });

  const newSession = createSession();

  return await Session.create({
    userId: maybeUser._id,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const refreshUser = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await Session.deleteOne({ _id: sessionId, refreshToken });

  return await Session.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(JWT_SECRET),
    {
      expiresIn: '15m',
    },
  );

  const templateFile = path.join(TEMPLATES_DIR, 'reset-password-email.html');

  const templateSource = await fs.readFile(templateFile, { encoding: 'utf-8' });

  console.log({ templateFile });

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `https://${APP_DOMAIN}/reset-password?token=${resetToken}`,
  });

  sendMail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPwd = async (password, token) => {
  try {
    const decoded = jwt.verify(token, env(JWT_SECRET));

    const user = await User.findOne({ _id: decoded.sub, email: decoded.email });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    throw error;
  }
};

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();

  if (!payload) throw createHttpError(401);

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await User.create({
      email: payload.email,
      name: payload.name,
      password,
    });
  }

  const newSession = createSession();

  return await Session.create({
    userId: user._id,
    ...newSession,
  });
};
