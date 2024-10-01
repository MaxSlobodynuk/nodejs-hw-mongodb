import { loginUser, registerUser } from '../services/auth.js';

export const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await registerUser({ name, email, password });

  res.json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  await loginUser(email, password);

  res.send('login complete');
};
