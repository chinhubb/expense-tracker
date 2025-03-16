import { useEffect, useState } from 'react';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import { fetchTransactions, deleteTransaction } from '../services/transactionService';
import { Transaction } from '../types/transactionTypes';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const HomePage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchType, setSearchType] = useState('');

  useEffect(() => {
    loadTransactions();
    const savedDate = localStorage.getItem('searchDate');
    const savedType = localStorage.getItem('searchType');
    if (savedDate) setSearchDate(savedDate);
    if (savedType) setSearchType(savedType);
  }, []);

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

  const handleSearchChange = (key: 'date' | 'type', value: string) => {
    if (key === 'date') {
      setSearchDate(value);
      localStorage.setItem('searchDate', value);
    } else {
      setSearchType(value);
      localStorage.setItem('searchType', value);
    }
  };

  const clearSearch = () => {
    setSearchDate('');
    setSearchType('');
    localStorage.removeItem('searchDate');
    localStorage.removeItem('searchType');
  };

  const exportToExcel = () => {
    if (filteredTransactions.length === 0) {
      alert('ไม่มีข้อมูลให้ Export');
      return;
    }

    const formattedData = filteredTransactions.map((txn) => ({
      วันที่: new Date(txn.date).toLocaleDateString(),
      ประเภท: txn.type === 'income' ? 'รายรับ' : 'รายจ่าย',
      จำนวนเงิน: txn.amount,
      หมายเหตุ: txn.note || '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(data, 'transactions.xlsx');
  };

  const filteredTransactions = transactions.filter((txn) => {
    const txnDate = new Date(txn.date).toISOString().split('T')[0];
    return (
      (searchDate ? txnDate === searchDate : true) && (searchType ? txn.type === searchType : true)
    );
  });

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-xl font-bold mt-6 mb-4">ระบบบันทึกรายรับ-รายจ่าย</h1>

      {/* Search Section */}
      <div className="bg-gray-100 p-3 rounded mb-4">
        <p className="text-gray-600 text-sm mb-2">ค้นหารายการที่นี่</p>
        <div className="flex flex-wrap gap-2">
          <input
            type="date"
            value={searchDate}
            onChange={(e) => handleSearchChange('date', e.target.value)}
            className="border text-sm p-1 rounded"
          />
          <select
            value={searchType}
            onChange={(e) => handleSearchChange('type', e.target.value)}
            className="border text-sm p-1 rounded"
          >
            <option value="">ทั้งหมด</option>
            <option value="income">รายรับ</option>
            <option value="expense">รายจ่าย</option>
          </select>
          <button
            onClick={clearSearch}
            className="bg-gray-500 text-white text-sm px-3 py-1 rounded hover:bg-gray-600 transition"
          >
            เคลียร์ค้นหา
          </button>
          <button
            onClick={exportToExcel}
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 transition"
          >
            Export Excel
          </button>
        </div>
      </div>

      <TransactionForm onTransactionAdded={loadTransactions} />

      <div className="mt-6">
        {filteredTransactions.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">ไม่พบข้อมูล</p>
        ) : (
          <TransactionList transactions={filteredTransactions} onDelete={handleDeleteTransaction} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
