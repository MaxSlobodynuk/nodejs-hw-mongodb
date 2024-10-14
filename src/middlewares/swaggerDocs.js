import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import { readFileSync } from 'node:fs';

import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
  try {
    const swaggerDoc = readFileSync(SWAGGER_PATH, "utf-8");
    const swaggerData = JSON.parse(swaggerDoc);
    return [...swaggerUI.serve, swaggerUI.setup(swaggerData)];
  } catch (error) {
    console.log(error)
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};
