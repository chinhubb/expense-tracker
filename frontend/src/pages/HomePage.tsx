import { useEffect, useState } from 'react';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import { fetchTransactions, deleteTransaction } from '../services/transactionService';
import { Transaction } from '../types/transactionTypes';

const HomePage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadTransactions = async () => {
    const data = await fetchTransactions();
    if (Array.isArray(data)) {
      setTransactions(data);
    } else {
      console.error('API did not return an array:', data);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    const confirmed = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?');
    if (!confirmed) return;

    const result = await deleteTransaction(id);
    if (result) {
      setTransactions((prev) => prev.filter((txn) => txn._id !== id));
    } else {
      console.error('Failed to delete transaction');
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-xl font-bold mt-6 mb-4">ระบบบันทึกรายรับ-รายจ่าย</h1>

      <TransactionForm onTransactionAdded={loadTransactions} />

      <div className="mt-6">
        <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
      </div>
    </div>
  );
};

export default HomePage;
