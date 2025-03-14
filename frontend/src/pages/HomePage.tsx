import { useEffect, useState } from 'react';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import { fetchTransactions } from '../services/transactionService';
import { Transaction } from '../types/transactionTypes';

const HomePage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadTransactions = async () => {
    const data = await fetchTransactions();
    if (Array.isArray(data)) {
      setTransactions(data);
    } else {
      console.error("API did not return an array:", data);
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
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
};

export default HomePage;
