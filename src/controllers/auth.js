import { registerUser } from '../services/auth.js';

export const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await registerUser({ name, email, password });

  res.json({
    status: 200,
    message: 'User registered!',
    data: user,
  });
};
