import express from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  deleteTransaction,
} from '../controllers/transactionController';
import { validateTransaction } from '../middleware/validateTransaction';

const router = express.Router();

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     description: Retrieve all transactions from the database
 *     responses:
 *       200:
 *         description: Successfully retrieved transactions
 */
router.get('/', getTransactions);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     description: Retrieve a single transaction by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The transaction ID
 *     responses:
 *       200:
 *         description: Successfully retrieved transaction
 *       404:
 *         description: Transaction not found
 */
router.get('/:id', getTransactionById);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     description: Add a new transaction to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: income
 *               amount:
 *                 type: number
 *                 example: 1000
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-03-15
 *               note:
 *                 type: string
 *                 example: Salary payment
 *     responses:
 *       201:
 *         description: Transaction created successfully
 */
router.post('/', validateTransaction, createTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     description: Remove a transaction from the database by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The transaction ID
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 */
router.delete('/:id', deleteTransaction);

export default router;
