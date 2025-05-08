import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TransactionsTable from "@/components/admin/transactions-table";

export default function TransactionsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/admin/transactions"],
  });
  
  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = searchTerm === "" || 
      transaction.id.toString().includes(searchTerm) || 
      transaction.userId.toString().includes(searchTerm) ||
      transaction.amount.toString().includes(searchTerm);
      
    const matchesType = !filterType || transaction.type === filterType;
    const matchesStatus = !filterStatus || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const exportCSV = () => {
    alert("Export functionality would be implemented here");
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          <Input 
            type="text" 
            placeholder="Search transactions..." 
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <Select onValueChange={(value) => setFilterType(value === "all" ? null : value)}>
            <SelectTrigger className="w-full md:w-[120px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="withdrawal">Withdrawal</SelectItem>
              <SelectItem value="win">Win</SelectItem>
              <SelectItem value="loss">Loss</SelectItem>
            </SelectContent>
          </Select>
          
          <Select onValueChange={(value) => setFilterStatus(value === "all" ? null : value)}>
            <SelectTrigger className="w-full md:w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportCSV} variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-4 w-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
            Export
          </Button>
        </div>
      </div>
      
      <TransactionsTable transactions={filteredTransactions || []} isLoading={isLoading} />
    </div>
  );
}
