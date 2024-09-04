import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res
      .status(err.status)
      .json({ status: err.status, message: err.name });
  }
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message,
  });
};
