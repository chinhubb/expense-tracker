import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import transactionRoutes from './routes/transactions';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.get('/', (req, res) => {
  res.send('Expense Tracker API is running...');
});

app.use('/api/transactions', transactionRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
