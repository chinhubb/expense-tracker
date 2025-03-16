import { Request, Response, NextFunction } from 'express';

export const validateTransaction = (req: Request, res: Response, next: NextFunction): void => {
  const { type, amount, date } = req.body;

  if (!type || !amount || !date) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  if (!['income', 'expense'].includes(type)) {
    res.status(400).json({ message: 'Invalid transaction type' });
    return;
  }

  if (typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ message: 'Invalid amount' });
    return;
  }

  next();
};
