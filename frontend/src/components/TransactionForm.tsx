import { useState } from 'react';
import { addTransaction } from '../services/transactionService';

const TransactionForm = ({ onTransactionAdded }: { onTransactionAdded: () => void }) => {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const transaction = {
        type,
        amount: parseFloat(amount),
        date,
        note
      };

      console.log('input:', transaction);

      const result = await addTransaction(transaction);

      if (result) {
        await onTransactionAdded();
      } else {
        console.error('Failed to add transaction');
      }

      setType('income');
      setAmount('');
      setDate('');
      setNote('');
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md space-y-4">
      <div className="flex space-x-2">
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="income">รายรับ</option>
          <option value="expense">รายจ่าย</option>
        </select>
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          placeholder="จำนวนเงิน" 
          required
          className="border p-2 rounded w-full"
        />
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required
          className="border p-2 rounded"
        />
      </div>
      <input 
        type="text" 
        value={note} 
        onChange={(e) => setNote(e.target.value)} 
        placeholder="หมายเหตุ (ถ้ามี)"
        className="border p-2 rounded w-full"
      />
      <button 
        type="submit"
        className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
      >
        เพิ่มรายการ
      </button>
    </form>
  );
};

export default TransactionForm;
