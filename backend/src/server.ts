import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import transactionRoutes from './routes/transactions';
import errorHandler from './middleware/errorHandler';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to database
connectDB().catch((err) => {
  console.error('Database connection failed:', err);
  process.exit(1);
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense Tracker API',
      version: '1.0.0',
      description: 'API for managing transactions',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5001}`,
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Test API
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running...');
});

// Transaction routes
app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
