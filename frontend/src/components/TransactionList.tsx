import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@heroicons/react/24/solid';

const TransactionList = ({ transactions, onDelete }: any) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  // Format date as dd/mm/yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Group transactions by date
  const groupedTransactions = transactions.reduce((acc: any, txn: any) => {
    const dateKey = new Date(txn.date).toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(txn);
    return acc;
  }, {});

  // Sort the grouped dates (newest first)
  const sortedDates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  // Toggle expand/collapse
  const toggleDate = (date: string) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">รายการรายรับ-รายจ่าย</h2>

      {sortedDates.map((date) => {
        const transactions = groupedTransactions[date];

        // Cal total income and expense
        const incomeTotal = transactions
          .filter((txn: any) => txn.type === 'income')
          .reduce((sum: number, txn: any) => sum + txn.amount, 0);

        const expenseTotal = transactions
          .filter((txn: any) => txn.type === 'expense')
          .reduce((sum: number, txn: any) => sum + txn.amount, 0);

        const total = incomeTotal - expenseTotal;
        const isExpanded = expandedDate === date;

        return (
          <div key={date} className="mb-4 bg-gray-100 p-3 rounded">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleDate(date)}
            >
              <h3 className="text-md font-bold flex items-center space-x-2">
                <span>{formatDate(date)}</span>
                <span className="text-gray-500 text-sm">(รวม {total.toLocaleString()} บาท)</span>
              </h3>
              <span className="text-sm">
                {isExpanded ? (
                  <ChevronUpIcon className="h-4 w-4 inline" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 inline" />
                )}
              </span>
            </div>

            {/* Expanded Transactions */}
            {isExpanded && (
              <div className="space-y-2 mt-2">
                {transactions.map((txn: any) => (
                  <div
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
                  </div>
                ))}

                {/* Show Total */}
                <div className="mt-2 text-sm font-semibold bg-white p-2 rounded shadow">
                  <p>รวมรายรับ: {incomeTotal.toLocaleString()} บาท</p>
                  <p>รวมรายจ่าย: {expenseTotal.toLocaleString()} บาท</p>
                  <p>ยอดรวมสุทธิ: {total.toLocaleString()} บาท</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TransactionList;
