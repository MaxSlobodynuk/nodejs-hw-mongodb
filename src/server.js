import express from 'express';
import cookieParser from 'cookie-parser'
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import contactRoutes from './routers/contacts.js';
import authRoutes from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const setupServer = () => {
  const app = express();
  app.use(cookieParser());

  const PORT = Number(env('PORT', '3000'));

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(authRoutes);
  app.use(contactRoutes);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
