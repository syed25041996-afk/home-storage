import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest } from './types';
import { UserModel } from './models';

export const authenticateBasic = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.status(401).json({ message: 'Authorization header missing or invalid' });
    return;
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (!username || !password) {
    res.status(401).json({ message: 'Invalid credentials format' });
    return;
  }

  try {
    const user = await UserModel.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    req.user = { id: user.id, username: user.username, role: user.role };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
};