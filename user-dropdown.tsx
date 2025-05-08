import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  LogOut, 
  Settings, 
  History, 
  Wallet, 
  CreditCard, 
  ChevronDown, 
  Mail, 
  Phone, 
  Coins 
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export function UserDropdown() {
  const { user, logoutMutation } = useAuth();
  const [_, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  
  if (!user) return null;
  
  const initials = user.fullName 
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() 
    : user.username.slice(0, 2).toUpperCase();
  
  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/");
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="flex items-center space-x-2 bg-muted hover:bg-accent rounded-full p-1 pl-1 pr-3 transition-colors duration-200">
        <Avatar className="w-9 h-9 border-2 border-primary/20">
          <AvatarFallback className="bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium hidden sm:inline">{user.username}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <div className="flex flex-col p-2 mb-2 bg-muted/30 rounded-md">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.fullName || user.username}</p>
              <p className="text-xs text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          
          <div className="space-y-2 mt-1 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Coins className="h-4 w-4 text-secondary" />
              <span className="font-medium text-foreground">৳{user.balance.toLocaleString()}</span>
              <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full ml-auto">Balance</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{user.email}</span>
            </div>
            
            {user.mobileNumber ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{user.mobileNumber}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span className="text-muted-foreground/60 italic text-xs">Add your mobile number in profile</span>
              </div>
            )}
          </div>
        </div>

        <DropdownMenuLabel className="text-xs text-muted-foreground">Account</DropdownMenuLabel>
        
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/transactions")}>
          <History className="mr-2 h-4 w-4" />
          <span>Transactions</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/deposit")}>
          <Wallet className="mr-2 h-4 w-4" />
          <span>Deposit</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/withdraw")}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Withdraw</span>
        </DropdownMenuItem>
        {user.role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/admin")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
