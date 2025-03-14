export interface Transaction {
    _id: string;
    type: "income" | "expense";
    amount: number;
    date: string;
    note?: string;
  }
  
  export interface TransactionListProps {
    transactions: Transaction[];
  }
  