import { Transaction } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { format } from "date-fns";

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export default function TransactionsTable({ transactions, isLoading }: TransactionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Query to get users for displaying usernames
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="h-16 bg-muted/50 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed rounded-lg">
        <h3 className="text-lg font-medium">No transactions found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }
  
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  
  const getUserName = (userId: number) => {
    const user = users?.find(user => user.id === userId);
    return user ? user.username : `User #${userId}`;
  };
  
  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "deposit":
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Deposit</Badge>;
      case "withdrawal":
        return <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">Withdrawal</Badge>;
      case "win":
        return <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">Win</Badge>;
      case "loss":
        return <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">Loss</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  const getTransactionStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70px]">ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">#{transaction.id}</TableCell>
                <TableCell>{getUserName(transaction.userId)}</TableCell>
                <TableCell>{getTransactionTypeLabel(transaction.type)}</TableCell>
                <TableCell className="font-semibold">
                  <span 
                    className={
                      transaction.type === "deposit" || transaction.type === "win" 
                      ? "text-success" 
                      : "text-destructive"
                    }
                  >
                    {transaction.type === "deposit" || transaction.type === "win" ? "+" : "-"}
                    ₹{transaction.amount}
                  </span>
                </TableCell>
                <TableCell>{transaction.method || "-"}</TableCell>
                <TableCell>{getTransactionStatusLabel(transaction.status || "completed")}</TableCell>
                <TableCell>
                  {transaction.createdAt 
                    ? format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')
                    : 'N/A'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, transactions.length)} of {transactions.length} transactions
          </p>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m15 18-6-6 6-6"></path></svg>
            </Button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m9 18 6-6-6-6"></path></svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
