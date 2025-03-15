import express from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  deleteTransaction,
} from '../controllers/transactionController';
import { validateTransaction } from '../middleware/validateTransaction';

const router = express.Router();

router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.post('/', validateTransaction, createTransaction);
router.delete('/:id', deleteTransaction);

export default router;
