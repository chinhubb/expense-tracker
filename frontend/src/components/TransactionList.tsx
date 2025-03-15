import React, { useState } from 'react';
import { TransactionListProps } from '../types/transactionTypes';
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@heroicons/react/24/solid';

interface TransactionListPropsWithDelete extends TransactionListProps {
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListPropsWithDelete> = ({ transactions, onDelete }) => {
  const [expandedDates, setExpandedDates] = useState<{ [key: string]: boolean }>({});

  const groupedTransactions = transactions.reduce((acc, txn) => {
    const dateKey = new Date(txn.date).toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(txn);
    return acc;
  }, {} as { [key: string]: typeof transactions });

  const toggleDate = (date: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">รายการรายรับ-รายจ่าย</h2>
      {Object.entries(groupedTransactions).map(([date, transactions]) => {
        const incomeTotal = transactions
          .filter((txn) => txn.type === 'income')
          .reduce((sum, txn) => sum + txn.amount, 0);

        const expenseTotal = transactions
          .filter((txn) => txn.type === 'expense')
          .reduce((sum, txn) => sum + txn.amount, 0);

        const total = incomeTotal - expenseTotal;

        return (
          <div key={date} className="mb-4 bg-gray-100 p-3 rounded">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleDate(date)}
            >
              <h3 className="text-md font-bold flex items-center space-x-2">
                <span>{date}</span>
                <span className="text-gray-500 text-sm">(รวม {total.toLocaleString()} บาท)</span>
              </h3>
              <span className="text-sm">
                {expandedDates[date] ? (
                  <ChevronUpIcon className="h-4 w-4 inline" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 inline" />
                )}
              </span>
            </div>

            {expandedDates[date] && (
              <ul className="space-y-2 mt-2">
                {transactions.map((txn) => (
                  <li
                    key={txn._id}
                    className={`p-2 rounded flex justify-between ${
                      txn.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <span>
                      {txn.type === 'income' ? 'รายรับ' : 'รายจ่าย'}: {txn.amount.toLocaleString()}{' '}
                      บาท
                      {txn.note && ` (${txn.note})`}
                    </span>
                    <button
                      onClick={() => onDelete(txn._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {expandedDates[date] && (
              <div className="mt-2 text-sm font-semibold">
                <p>--------------------------------------</p>
                <p>รวมรายรับ: {incomeTotal.toLocaleString()} บาท</p>
                <p>รวมรายจ่าย: {expenseTotal.toLocaleString()} บาท</p>
                <p>ยอดรวมสุทธิ: {total.toLocaleString()} บาท</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TransactionList;
