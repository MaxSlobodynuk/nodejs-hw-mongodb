import bcrypt from 'bcrypt';
import { User } from '../db/models/user.js';
import createHttpError from 'http-errors';

export const registerUser = async (user) => {
  const maybeUser = User.findOne({ email: user.email });

  if (!maybeUser) {
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
  
};
