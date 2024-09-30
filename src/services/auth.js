import bcrypt from 'bcrypt';
import { User } from '../db/models/user.js';

export const registerUser = async (user) => {
  user.password = await bcrypt.hash(user.password, 10);

  const result = await User.create(user);

  return result;
};
