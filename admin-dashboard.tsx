import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserDropdown } from "@/components/ui/user-dropdown";
import UsersTab from "@/pages/admin/users";
import GamesManagementTab from "@/pages/admin/games-management";
import TransactionsTab from "@/pages/admin/transactions";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { User, Game, Transaction } from "@shared/schema";
import { Helmet } from "react-helmet";
import StatCard from "@/components/admin/stat-card";
import { Users, Wallet, BarChart4, CreditCard } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });
  
  const { data: games } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });
  
  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ["/api/admin/transactions"],
  });
  
  // Calculate stats
  const totalUsers = users?.length || 0;
  
  const totalDeposits = transactions
    ?.filter(t => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0) || 0;
    
  const totalWithdrawals = transactions
    ?.filter(t => t.type === "withdrawal")
    .reduce((sum, t) => sum + t.amount, 0) || 0;
    
  const activeGames = games?.filter(g => g.isActive).length || 0;
  
  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin Dashboard - BetRoyal Casino</title>
        <meta name="description" content="Admin dashboard for BetRoyal Casino" />
      </Helmet>
      
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">
                <span className="text-secondary">Bet</span>
                <span className="text-foreground">Royal</span>
                <span className="text-primary ml-2 text-sm">Admin</span>
              </h1>
              <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground">
                View Site
              </Button>
            </div>
            
            <div className="flex items-center">
              <Button variant="ghost" className="mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 h-5 w-5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
                Notifications
                <Badge className="ml-1 bg-primary text-white">3</Badge>
              </Button>
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={totalUsers.toString()}
            icon={<Users className="h-5 w-5" />}
            trend="up"
            trendValue="12%"
            color="blue"
          />
          
          <StatCard
            title="Total Deposits"
            value={`₹${(totalDeposits / 1000).toFixed(1)}K`}
            icon={<Wallet className="h-5 w-5" />}
            trend="up"
            trendValue="8%"
            color="green"
          />
          
          <StatCard
            title="Withdrawals"
            value={`₹${(totalWithdrawals / 1000).toFixed(1)}K`}
            icon={<CreditCard className="h-5 w-5" />}
            trend="down"
            trendValue="3%"
            color="yellow"
          />
          
          <StatCard
            title="Active Games"
            value={activeGames.toString()}
            icon={<BarChart4 className="h-5 w-5" />}
            trend="up"
            trendValue="2"
            color="purple"
          />
        </div>
        
        {/* Tabs */}
        <Card>
          <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-border">
              <div className="container">
                <TabsList className="p-0 h-auto bg-transparent border-0">
                  <TabsTrigger 
                    value="users" 
                    className="py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                  >
                    Users
                  </TabsTrigger>
                  <TabsTrigger 
                    value="games" 
                    className="py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                  >
                    Games
                  </TabsTrigger>
                  <TabsTrigger 
                    value="transactions" 
                    className="py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                  >
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            <CardContent className="p-6">
              <TabsContent value="users" className="mt-0">
                <UsersTab />
              </TabsContent>
              <TabsContent value="games" className="mt-0">
                <GamesManagementTab />
              </TabsContent>
              <TabsContent value="transactions" className="mt-0">
                <TransactionsTab />
              </TabsContent>
              <TabsContent value="settings" className="mt-0">
                <div className="text-center p-10">
                  <h3 className="text-lg font-medium">Settings tab content coming soon</h3>
                  <p className="text-muted-foreground mt-2">This section is under development</p>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}
