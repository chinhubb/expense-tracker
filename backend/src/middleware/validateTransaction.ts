import { Request, Response, NextFunction } from 'express';

export const validateTransaction = (req: Request, res: Response, next: NextFunction): void => {
  const { type, amount, date } = req.body;
  if (!type || !amount || !date) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }
  next();
};
