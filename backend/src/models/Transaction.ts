import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  note: { type: String, required: false }
}, { timestamps: true });

export default mongoose.model('Transaction', TransactionSchema);
