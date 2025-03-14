import React from 'react';
import { TransactionListProps } from '../types/transactionTypes';

const groupByDate = (transactions: TransactionListProps['transactions']) => {
  return transactions.reduce((acc, txn) => {
    const date = new Date(txn.date).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(txn);
    return acc;
  }, {} as Record<string, typeof transactions>);
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const groupedTransactions = groupByDate(transactions);

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-lg font-semibold">รายการรายรับ-รายจ่าย</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No results</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedTransactions).map(([date, txns]) => (
            <div key={date} className="bg-gray-100 p-2 rounded">
              <h3 className="font-bold text-gray-700">{date}</h3>
              <ul className="space-y-2">
                {txns.map((txn) => (
                  <li
                    key={txn._id}
                    className={`p-2 rounded ${txn.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {txn.type === 'income' ? 'รายรับ' : 'รายจ่าย'} - {txn.amount} บาท
                    {txn.note && ` - ${txn.note}`}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
