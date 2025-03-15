import { Request, Response } from 'express';
import Transaction from '../models/Transaction';

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
};

export const getTransactionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction', error });
  }
};

export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, amount, date, note } = req.body;
    if (!type || !amount || !date) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    const newTransaction = new Transaction({ type, amount, date, note });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error });
  }
};

export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    res.json({ message: 'Transaction deleted successfully', deletedTransaction });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error });
  }
};
